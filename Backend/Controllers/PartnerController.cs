using Backend.DTO;
using Backend.Models;
using Backend.Services.UserService;
using Backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("partner")]
public class PartnerController : ControllerBase
{
    private readonly DBPetGuardians _context;
    private readonly IUserService _userService;

    public PartnerController(DBPetGuardians context, IUserService userService)
    {
        this._context = context;
        this._userService = userService;
    }


    /// <summary>
    /// Cria um `Partner`.
    /// </summary>
    [HttpPost]
    [AllowAnonymous]
    public ActionResult<Shelter> CreatePartner(CreatePartnerDto request)
    {
        AuthUtils.CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passowordSalt);

        if (!CpfCnpjUtils.IsCnpj(request.CNPJ))
        {
            return BadRequest("CNPJ inválido.");
        }

        if (!MailUtils.isValid(request.Email))
        {
            return BadRequest("Email inválido.");
        }

        if (_context.Persons.Where(s => s.GCG == request.CNPJ).FirstOrDefault() != null)
        {
            return BadRequest("Já existe este CNPJ cadastrado.");
        }

        if (_context.Persons.Where(s => s.Email == request.Email).FirstOrDefault() != null)
        {
            return BadRequest("Já existe este Email cadastrado.");
        }

        Partner _partner = new Partner
        {
            Name = request.CorporateName,
            FantasyName = request.FantasyName,
            Email = request.Email,
            PasswordSalt = passowordSalt,
            PasswordHash = passwordHash,
            CEP = request.CEP,
            City = request.City,
            Complement = request.Complement,
            District = request.District,
            Street = request.Street,
            StreetNumber = request.StreetNumber,
            UF = request.UF,
            GCG = request.CNPJ,
            Telephone = request.Telephone,
            RegType = 'J',
            LinkSite = request.LinkSite
        };
        _context.Partners.Add(_partner);
        _context.SaveChanges();
        return Ok(_partner.Id);
    }


    /// <summary>
    /// Consulta um `Partner`
    /// </summary>
    [HttpGet]
    [Route("{id}")]
    [AllowAnonymous]
    public ActionResult GetPartner(int id)
    {
        Partner? _partner = _context.Partners.Where(s => s.Id == id && s.Active).Include(s => s.Coupons).FirstOrDefault();
        if (_partner == null)
        {
            return NotFound();
        }
        return Ok(_partner);
    }


    /// <summary>
    /// Atualiza o Abrigo
    /// </summary>
    [HttpPatch]
    [Authorize(Roles = "Partner")]
    public ActionResult UpdatePartner([FromForm] UpdatePartnerDto request)
    {
        Partner? _partner = _context.Partners.Where(s => s.Id == _userService.GetId() && s.Active).Include(s => s.Images).FirstOrDefault();
        if (_partner == null)
        {
            return NotFound();
        }

        _partner.CEP = request.CEP;
        _partner.UF = request.UF;
        _partner.City = request.City;
        _partner.Street = request.Street;
        _partner.StreetNumber = request.StreetNumber;
        _partner.District = request.District;
        _partner.Complement = request.Complement ?? "";
        _partner.Telephone = request.Telephone;
        _partner.FantasyName = request.FantasyName ?? "";
        _partner.LinkSite = request.LinkSite ?? "";

        _context.SaveChanges();
        return Ok();
    }


    /// <summary>
    /// Inativa um `Partner`
    /// </summary>
    [HttpDelete]
    [Authorize(Roles = "Shelter")]
    public ActionResult Delete()
    {
        Partner? _partner = _context.Partners.Find(_userService.GetId());
        if (_partner == null)
        {
            return NotFound();
        }
        _partner.Active = false;
        _context.SaveChanges();
        return Ok();
    }

}