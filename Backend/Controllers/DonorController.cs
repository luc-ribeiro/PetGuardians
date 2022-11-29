using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Utils;
using Backend.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Backend.Services.UserService;
using MimeTypes;

namespace Backend.Controllers;


[ApiController]
[Route("donor")]
public class DonorController : ControllerBase
{
    private readonly DBPetGuardians _context;
    private readonly IUserService _userService;

    public DonorController(DBPetGuardians db, IUserService userService)
    {
        this._context = db;
        this._userService = userService;
    }

    /// <summary>
    /// Cria um `Donor`.
    /// </summary>
    [HttpPost]
    [AllowAnonymous]
    public ActionResult<int> Create(CreateDonorDto request)
    {
        AuthUtils.CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passowordSalt);

        // Pega a data de hoje
        DateTime today = DateTime.Today;

        // Calcula a idade
        int age = today.Year - request.Birthday.Year;

        // Ajusta o cálculo para ano bissexto
        if (request.Birthday.Date > today.AddYears(-age))
        {
            age--;
        }

        if (age < 18)
        {
            return BadRequest("Doador deve ser maior de idade.");
        }


        if (!CpfCnpjUtils.isCpf(request.CPF))
        {
            return BadRequest("CPF inválido.");
        }

        if (!MailUtils.isValid(request.Email))
        {
            return BadRequest("Email inválido.");
        }

        if (_context.Persons.Where(s => s.GCG == request.CPF).FirstOrDefault() != null)
        {
            return BadRequest("Já existe este CPF cadastrado.");
        }

        if (_context.Persons.Where(s => s.Email == request.Email).FirstOrDefault() != null)
        {
            return BadRequest("Já existe este Email cadastrado.");
        }


        Donor donor = new Donor
        {
            Name = request.FullName,
            Birthday = request.Birthday,
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
            GCG = request.CPF,
            Telephone = request.Telephone,
            RegType = 'F'
        };
        _context.Donors.Add(donor);
        _context.SaveChanges();
        return Ok(donor.Id);
    }


    /// <summary>
    /// Consulta um `Donor`
    /// </summary>
    [HttpGet]
    [Route("{id}")]
    [AllowAnonymous]
    public ActionResult Read(int id)
    {
        var _donor = _context.Donors.Where(d => d.Id == id && d.Active).Select(d => new
        {
            id = d.Id,
            name = d.Name,
            gcg = d.GCG,
            telephone = d.Telephone,
            cep = d.CEP,
            uf = d.UF,
            city = d.City,
            street = d.Street,
            streetNumber = d.StreetNumber,
            district = d.District,
            complement = d.Complement,
            email = d.Email,
            profilePicture = d.ProfilePicture,
            profilePictureMimeType = d.ProfilePictureMimeType,
            Donations = d.Donations.Select(d => new
            {
                shelter = d.Shelter.Name,
                approved = d.Approved,
                approvedAt = d.ApprovedAt,
                value = d.Value,
                keyPIX = d.KeyPix
            }).ToList()
        });

        if (_donor == null)
        {
            return NotFound();
        }
        return Ok(_donor);
    }

    /// <summary>
    /// Atualiza o `Donor`
    /// </summary>
    [HttpPatch]
    [Authorize(Roles = "Donor")]
    public async Task<ActionResult> Update([FromForm] UpdateDonorDto request)
    {
        Donor? _donor = _context.Donors.Where(s => s.Id == _userService.GetId() && s.Active).FirstOrDefault();
        if (_donor == null)
        {
            return NotFound();
        }

        _donor.CEP = request.CEP;
        _donor.UF = request.UF;
        _donor.City = request.City;
        _donor.Street = request.Street;
        _donor.StreetNumber = request.StreetNumber;
        _donor.District = request.District;
        _donor.Complement = request.Complement ?? "";
        _donor.Telephone = request.Telephone;
        _donor.Name = request.FullName;

        using (var memoryStream = new MemoryStream())
        {
            if (request.ProfilePicture != null && request.ProfilePicture.Length > 0)
            {
                await request.ProfilePicture.CopyToAsync(memoryStream);
                if (memoryStream.Length > 2097152)
                {
                    return BadRequest("Tamanho da foto de perfil muito grande");
                }
                _donor.ProfilePicture = System.Convert.ToBase64String(memoryStream.ToArray());
                _donor.ProfilePictureMimeType = MimeTypeMap.GetMimeType(Path.GetExtension(request.ProfilePicture.FileName));
            }
        }

        _context.SaveChanges();
        return Ok();
    }

    /// <summary>
    /// Inativa um `Donor`
    /// </summary>
    [HttpDelete]
    [Authorize(Roles = "Donor")]
    public ActionResult Delete()
    {
        Donor? _donor = _context.Donors.Find(_userService.GetId());
        if (_donor == null)
        {
            return NotFound();
        }
        _donor.Active = false;
        _context.SaveChanges();
        return Ok();
    }
}