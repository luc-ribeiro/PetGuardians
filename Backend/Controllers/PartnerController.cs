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
    /// Consulta de `Partner` por região
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public ActionResult Read()
    {
        return Ok(_context.Partners.Where(s => s.Active).ToList());
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
    [Authorize(Roles = "Partner")]
    public ActionResult DisablePartner()
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


    [HttpPost]
    [Authorize(Roles = "Partner")]
    [Route("coupon")]
    public ActionResult CreateCoupon(CouponDto request)
    {
        int partnerId = _userService.GetId();
        Coupon? _coupon = _context.Coupons.Where(c => c.Code == request.code && c.PartnerId == partnerId).FirstOrDefault();
        if (_coupon == null)
        {
            _coupon = new Coupon
            {
                Code = request.code,
                PartnerId = partnerId
            };
            _context.Coupons.Add(_coupon);
        }
        else
        {
            _coupon.Active = true;
            _coupon.CreatedAt = DateTime.Now;
        }
        _context.SaveChanges();
        return Ok(_coupon.Id);
    }

    [HttpPatch]
    [Route("coupon/{id}")]
    [Authorize(Roles = "Partner")]
    public ActionResult UpdateCoupon(int id, CouponDto request)
    {

        int partnerId = _userService.GetId();
        if (request.active == null)
        {
            return BadRequest("Active é um campo obrigatório");
        }
        Coupon? coupon = _context.Coupons.Where(c => c.Id == id && c.PartnerId == partnerId).FirstOrDefault();
        if (coupon == null)
        {
            return NotFound("Cupom inválido");
        }
        Coupon? _coupon = _context.Coupons.Where(c => c.Code == request.code && c.PartnerId == partnerId && c.Id != id).FirstOrDefault();
        if (_coupon != null)
        {
            return BadRequest("Já existe um cupom com este código cadastrado");
        }
        coupon.Code = request.code;
        coupon.Active = (bool)request.active;
        _context.SaveChanges();
        return Ok();
    }
}