using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Backend.Utils;
using Microsoft.EntityFrameworkCore;
using Backend.Services.UserService;
using System.Security.Cryptography;
using Backend.DTO;

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
    public ActionResult<string> LogIn(LoginDto request)
    {

        Person? person = _context.Persons.Where(p => p.Email.Equals(request.Email)).FirstOrDefault();

        if (person == null)
        {
            return NotFound("Usuário não encontrado.");
        }

        if (!AuthUtils.VerifyPasswordHash(request.Password, person.PasswordHash, person.PasswordSalt))
        {
            return BadRequest("Senha inválida.");
        }

        string role = getPersonRole(person);
        string token = CreateAccessToken(person, role);
        CreateAndSetRefreshToken(person);

        var response = new
        {
            id = person.Id,
            role,
            profilePicture = person.ProfilePicture != null && person.ProfilePictureMimeType != null ? $"data:{person.ProfilePictureMimeType};base64,{person.ProfilePicture}" : null,
            accessToken = token
        };

        return Ok(response);
    }


    [HttpPost]
    [Route("logout")]
    public ActionResult LogOut()
    {

        CookieOptions cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.Now.AddDays(-1),
            SameSite = SameSiteMode.None,
            Secure = true
        };
        Response.Cookies.Append("refreshToken", "", cookieOptions);

        Person? person = _context.Persons.Where(p => p.Id == _userService.GetId()).FirstOrDefault();
        if (person == null)
        {
            return Ok();
        }
        person.RefreshToken = null;
        _context.SaveChanges();
        return Ok();
    }

    /// <summary>
    /// Cria um novo token de acesso e um novo token de renovação
    /// </summary>
    [HttpPost]
    [Route("refresh")]
    public ActionResult RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (refreshToken == null)
        {
            return Unauthorized("Token Expirado");
        }
        Person? person = _context.Persons.Include(u => u.RefreshToken).Where(u => u.RefreshToken != null && u.RefreshToken.Token.Equals(refreshToken)).FirstOrDefault();

        if (person == null || person.RefreshToken == null)
        {
            return Unauthorized("Token Inválido");
        }
        if (person.RefreshToken.Expires < DateTime.Now)
        {
            return Unauthorized("Token Expirado");
        }
        string role = getPersonRole(person);
        string token = CreateAccessToken(person, role);
        CreateAndSetRefreshToken(person);
        return Ok(new
        {
            id = person.Id,
            profilePicture = person.ProfilePicture != null && person.ProfilePictureMimeType != null ? $"data:{person.ProfilePictureMimeType};base64,{person.ProfilePicture}" : null,
            role,
            accessToken = token
        });
    }
    private string CreateAccessToken(Person person, string role)
    {
        List<Claim> claims = new List<Claim>{
            new Claim(ClaimTypes.NameIdentifier, person.Id.ToString()),
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

    private RefreshToken CreateAndSetRefreshToken(Person person)
    {
        RefreshToken refreshToken = new RefreshToken
        {
            Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
            Expires = DateTime.Now.AddDays(7),
            Person = person
        };

        CookieOptions cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = refreshToken.Expires,
            SameSite = SameSiteMode.None,
            Secure = true
        };
        Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);

        RefreshToken? currentToken = _context.RefreshTokens.Find(person.Id);
        if (currentToken != null)
        {
            _context.RefreshTokens.Remove(currentToken);
        }
        _context.RefreshTokens.Add(refreshToken);

        _context.SaveChanges();
        return refreshToken;
    }


    private string getPersonRole(Person person)
    {
        Shelter? shelter = _context.Shelters.Find(person.Id);
        Donor? donor = _context.Donors.Find(person.Id);
        Partner? partner = _context.Partners.Find(person.Id);

        return (shelter ?? donor ?? partner ?? person).GetType().Name;
    }

}