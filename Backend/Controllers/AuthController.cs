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
    public ActionResult<string> Login(LoginDto request)
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


        Shelter? shelter = _context.Shelters.Find(person.Id);
        Donor? donor = _context.Donors.Find(person.Id);
        Partner? partner = _context.Partners.Find(person.Id);
        var type = (shelter ?? donor ?? partner ?? person);
        string role = type.GetType().Name;

        string token = CreateAccessToken(person, role);
        CreateAndSetRefreshToken(person);

        var response = new
        {
            person,
            role,
            shelter = shelter == null ? null : new
            {
                FantasyName = shelter.FantasyName,
                KeyPIX = shelter.KeyPIX,
                About = shelter.About
            },
            donor = donor == null ? null : new
            {
                Birthday = donor.Birthday
            },
            partner = partner == null ? null : new
            {
                FantasyName = partner.FantasyName,
                LinkSite = partner.LinkSite
            },
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
        Person? person = _context.Persons.Include(u => u.RefreshToken).Where(u => u.RefreshToken != null && u.RefreshToken.Token.Equals(refreshToken)).FirstOrDefault();

        if (person == null || person.RefreshToken == null)
        {
            return Unauthorized("Token Inválido");
        }

        if (person.RefreshToken.Expires < DateTime.Now)
        {
            return Unauthorized("Token Expirado");
        }
        string token = CreateAccessToken(person);
        CreateAndSetRefreshToken(person);
        return token;
    }
    private string CreateAccessToken(Person person, string? role = null)
    {
        if (role == null)
        {
            Shelter? shelter = _context.Shelters.Find(person.Id);
            Donor? donor = _context.Donors.Find(person.Id);
            Partner? partner = _context.Partners.Find(person.Id);
            var type = (shelter ?? donor ?? partner ?? person);
            role = type.GetType().Name;
        }

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
            Expires = refreshToken.Expires
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

}