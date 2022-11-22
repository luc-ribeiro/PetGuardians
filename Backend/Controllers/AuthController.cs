using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Backend.Utils;
using Microsoft.EntityFrameworkCore;
using MimeTypes;
using Microsoft.AspNetCore.Authorization;
using Backend.Services.UserService;
using System.Security.Cryptography;

namespace Backend.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly DBPetGuardians _context;
    private readonly IConfiguration _configuration;
    private readonly IUserService _userService;

    public AuthController(DBPetGuardians db, IConfiguration configuration, IUserService userService)
    {
        this._context = db;
        this._configuration = configuration;
        this._userService = userService;
    }

    /// <summary>
    /// Loga no sistema e cria token de acesso e de renovação
    /// </summary>
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
        var token = CreateAccessToken(type);
        CreateAndSetRefreshToken(user);

        var response = new
        {
            Shelter = shelter != null,
            User = user,
            AccessToken = token
        };

        return Ok(response);
    }

    /// <summary>
    /// Cria um novo token de acesso e um novo token de renovação
    /// </summary>
    [HttpPost]
    [Route("refresh")]
    public ActionResult<string> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        User? user = _context.Users.Include(u => u.RefreshToken).Where(u => u.RefreshToken != null && u.RefreshToken.Token.Equals(refreshToken)).FirstOrDefault();

        if (user == null || user.RefreshToken == null)
        {
            return Unauthorized("Token Inválido");
        }

        if (user.RefreshToken.Expires < DateTime.Now)
        {
            return Unauthorized("Token Expirado");
        }

        string token = CreateAccessToken(user);
        CreateAndSetRefreshToken(user);
        return token;
    }
    private string CreateAccessToken(User user)
    {
        Shelter? shelter = _context.Shelters.Find(user.Id);
        string role = (shelter ?? user).GetType().Name;

        List<Claim> claims = new List<Claim>{
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
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

    private RefreshToken CreateAndSetRefreshToken(User user)
    {
        RefreshToken refreshToken = new RefreshToken
        {
            Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
            Expires = DateTime.Now.AddDays(7),
            User = user
        };

        CookieOptions cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = refreshToken.Expires
        };
        Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);

        RefreshToken? currentToken = _context.RefreshTokens.Find(user.Id);
        if (currentToken != null)
        {
            _context.RefreshTokens.Remove(currentToken);
        }
        _context.RefreshTokens.Add(refreshToken);

        _context.SaveChanges();
        return refreshToken;
    }

}