using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Backend.Utils;
using Microsoft.EntityFrameworkCore;
using MimeTypes;

namespace Backend.Controllers;

[ApiController]
[Route("user")]
public class UserController : ControllerBase
{
    private readonly DBPetGuardians _context;
    private readonly IConfiguration _configuration;

    public UserController(DBPetGuardians db, IConfiguration configuration)
    {
        this._context = db;
        this._configuration = configuration;
    }

    [HttpPost]
    [Route("login")]
    public ActionResult<string> Login(UserDto request)
    {

        User? user = _context.Users.Where(u => u.Email.Equals(request.Email)).Include(user => user.ProfilePicture).FirstOrDefault();

        if (user == null)
        {
            return NotFound("Usuário não encontrado.");
        }

        if (!AuthUtils.VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
        {
            return BadRequest("Senha inválida.");
        }

        Shelter? shelter = _context.Shelters.Find(user.Id);
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

    [HttpPatch]
    [Route("/{id}")]
    public async Task<ActionResult<string>> UpdateProfilePicture(int id, IFormFile file)
    {
        User? user = _context.Users.Find(id);

        if (user == null)
        {
            return NotFound("Usuário Inválido");
        }

        if (file.Length <= 0)
        {
            return BadRequest("Arquivo Inválido");
        }

        using (var memoryStream = new MemoryStream())
        {
            await file.CopyToAsync(memoryStream);

            if (memoryStream.Length > 2097152)
            {
                return BadRequest("Tamanho do arquivo muito grande");
            }

            Image image = new Image()
            {
                Base64 = System.Convert.ToBase64String(memoryStream.ToArray()),
                MimeType = MimeTypeMap.GetMimeType(Path.GetExtension(file.FileName)),
                Size = file.Length
            };

            // Remove a imagem antiga do usuário
            Image? currentImage = _context.Images.Find(user.ImageId);
            if (currentImage != null)
            {
                _context.Images.Remove(currentImage);
            }

            // Atualiza a imagem atual do usuário
            user.ProfilePicture = image;

            _context.SaveChanges();
            return Ok(image.Id);
        }
    
    }


    private string CreateToken(User user, string role)
    {
        List<Claim> claims = new List<Claim>{
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, role),
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString())
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