using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Utils;

namespace Backend.Controllers;


[ApiController]
[Route("shelter")]

public class ShelterController : ControllerBase
{
    private DBPetGuardians db;

    public ShelterController(DBPetGuardians db)
    {
        this.db = db;
    }


    [HttpPost]
    public ActionResult Create(Shelter shelter)
    {

        // Pega a data de hoje
        DateTime today = DateTime.Today;

        // CCalcula a idade
        int age = today.Year - shelter.Birthday.Year;

        // Ajusta o cálculo para ano bissexto
        if (shelter.Birthday.Date > today.AddYears(-age))
        {
            age--;
        }

        if (age < 18)
        {
            return BadRequest("Responsável deve ser maior de idade.");
        }

        if (!CpfCnpjUtils.isValid(shelter.CPF))
        {
            return BadRequest("CPF inválido.");
        }

        if (!CpfCnpjUtils.isValid(shelter.CNPJ))
        {
            return BadRequest("CNPJ inválido.");
        }

        if (!MailUtils.isValid(shelter.Email))
        {
            return BadRequest("Email inválido.");
        }

        if (db.Shelters.Where(s => s.CPF == shelter.CPF).FirstOrDefault() != null)
        {
            return BadRequest("Já existe este CPF cadastrado.");
        }

        if (db.Shelters.Where(s => s.CNPJ == shelter.CNPJ).FirstOrDefault() != null)
        {
            return BadRequest("Já existe este CNPJ cadastrado.");
        }

        if (db.Shelters.Where(s => s.Email == shelter.Email).FirstOrDefault() != null)
        {
            return BadRequest("Já existe este Email cadastrado.");
        }

        db.Shelters.Add(shelter);
        db.SaveChanges();
        return Created(shelter.Id.ToString(), shelter);
    }

    [HttpGet]
    [Route("{id}")]
    public ActionResult Read(int id)
    {
        Shelter? shelter = db.Shelters.Find(id);
        if (shelter == null)
        {
            return NotFound();
        }
        return Ok(shelter);
    }


    [HttpGet]
    public ActionResult Read(string corporateName, string UF, string city)
    {
        return Ok(db.Shelters.Where(s => s.CorporateName.Contains(corporateName) && s.UF.Equals(UF) && s.City.Equals(city)).ToList());
    }

    [HttpPatch]
    [Route("{id}")]
    public ActionResult Update(int id, Shelter shelter)
    {
        Shelter? _shelter = db.Shelters.Find(id);
        if (_shelter == null)
        {
            return NotFound();
        }

        _shelter.CorporateName = shelter.CorporateName;
        _shelter.Slug = shelter.Slug;
        db.SaveChanges();
        return Ok();
    }

    [HttpDelete]
    [Route("{id}")]
    public ActionResult Delete(int id)
    {
        Shelter? shelter = db.Shelters.Find(id);
        if (shelter == null)
        {
            return NotFound();
        }
        db.Shelters.Remove(shelter);
        db.SaveChanges();
        return Ok();
    }
}