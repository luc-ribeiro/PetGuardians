using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Utils;
namespace Backend.Controllers;


[ApiController]
[Route("shelter")]

public class ShelterController : ControllerBase
{
    private readonly DBPetGuardians _context;

    public ShelterController(DBPetGuardians db)
    {
        this._context = db;
    }

    [HttpPost]
    public ActionResult<Shelter> Create(ShelterDto request)
    {

        AuthUtils.CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passowordSalt);

        // Pega a data de hoje
        DateTime today = DateTime.Today;

        // CCalcula a idade
        int age = today.Year - request.Birthday.Year;

        // Ajusta o cálculo para ano bissexto
        if (request.Birthday.Date > today.AddYears(-age))
        {
            age--;
        }

        if (age < 18)
        {
            return BadRequest("Responsável deve ser maior de idade.");
        }

        if (!CpfCnpjUtils.isValid(request.CPF))
        {
            return BadRequest("CPF inválido.");
        }

        if (!CpfCnpjUtils.isValid(request.CNPJ))
        {
            return BadRequest("CNPJ inválido.");
        }

        if (!MailUtils.isValid(request.Email))
        {
            return BadRequest("Email inválido.");
        }

        if (_context.Shelters.Where(s => s.CPF == request.CPF).FirstOrDefault() != null)
        {
            return BadRequest("Já existe este CPF cadastrado.");
        }

        if (_context.Shelters.Where(s => s.CNPJ == request.CNPJ).FirstOrDefault() != null)
        {
            return BadRequest("Já existe este CNPJ cadastrado.");
        }

        if (_context.Shelters.Where(s => s.Email == request.Email).FirstOrDefault() != null)
        {
            return BadRequest("Já existe este Email cadastrado.");
        }

        Shelter shelter = new Shelter
        {
            Name = request.Name,
            Birthday = request.Birthday,
            CPF = request.CPF,
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
            CNPJ = request.CNPJ,
            About = request.About,
            CorporateName = request.CorporateName
        };

        _context.Shelters.Add(shelter);
        _context.SaveChanges();
        return Ok(shelter.Id);
    }


    [HttpGet]
    [Route("{id}")]
    public ActionResult Read(int id)
    {
        Shelter? shelter = _context.Shelters.Find(id);
        if (shelter == null)
        {
            return NotFound();
        }
        return Ok(shelter);
    }


    [HttpGet]
    public ActionResult Read(string corporateName, string UF, string city)
    {
        return Ok(_context.Shelters.Where(s => s.CorporateName.Contains(corporateName) && s.UF.Equals(UF) && s.City.Equals(city)).ToList());
    }

    [HttpPatch]
    [Route("{id}")]
    public ActionResult Update(int id, Shelter shelter)
    {
        Shelter? _shelter = _context.Shelters.Find(id);
        if (_shelter == null)
        {
            return NotFound();
        }

        _shelter.CorporateName = shelter.CorporateName;
        _shelter.About = shelter.About;
        _context.SaveChanges();
        return Ok();
    }

    [HttpDelete]
    [Route("{id}")]
    public ActionResult Delete(int id)
    {
        Shelter? shelter = _context.Shelters.Find(id);
        if (shelter == null)
        {
            return NotFound();
        }
        _context.Shelters.Remove(shelter);
        _context.SaveChanges();
        return Ok();
    }

}