using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Backend.Utils;

namespace Backend.Controllers;

[ApiController]
[Route("user")]
public class UserController : ControllerBase
{
    private DBPetGuardians context;
    private readonly IConfiguration _configuration;

    public UserController(DBPetGuardians db, IConfiguration configuration)
    {
        this.context = db;
        this._configuration = configuration;
    }

    [HttpPost]
    [Route("login")]
    public ActionResult<string> Login(UserDto request)
    {

        User? user = context.Users.Where(u => u.Email.Equals(request.Email)).FirstOrDefault();

        if (user == null)
        {
            return NotFound("Usuário não encontrado.");
        }

        if (!AuthUtils.VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
        {
            return BadRequest("Senha inválida.");
        }

        Shelter? shelter = context.Shelters.Find(user.Id);
        var type = shelter ?? user;
        var token = CreateToken(type, type.GetType().Name);

        var response = new
        {
            Shelter = shelter != null,
            User = user,
            Token = token
        };

        return Ok(response);
    }



    private string CreateToken(User user, string role)
    {
        List<Claim> claims = new List<Claim>{
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("JWT:Key").Value));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

}