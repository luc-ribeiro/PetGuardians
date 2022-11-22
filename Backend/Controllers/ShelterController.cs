using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Utils;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MimeTypes;
using Microsoft.EntityFrameworkCore;

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

        /*  
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
         */

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
        var shelter = _context.Shelters.Where(s => s.Id == id).Select(s => new {
            s.Id,
            s.ProfilePicture,
            s.Images
        }).FirstOrDefault();

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
    [Authorize]
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

    [HttpPatch]
    [Route("{id}/images")]
    public async Task<ActionResult> UploadImages(int id, List<IFormFile> files)
    {

        Shelter? shelter = _context.Shelters.Find(id);

        if (shelter == null)
        {
            return NotFound("Abrigo Inválido");
        }

        using (var memoryStream = new MemoryStream())
        {

            foreach (var file in files)
            {
                if (file.Length <= 0)
                {
                    return BadRequest("Arquivo Inválido");
                }


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

                shelter.Images.Add(image);
            }
        }

        _context.SaveChanges();
        return Ok();
    }

    [HttpDelete]
    [Route("{id}")]
    [Authorize(Roles = "Shelter")]
    public ActionResult Delete(int id)
    {
        Shelter? shelter = _context.Shelters.Find(id);
        if (shelter == null)
        {
            return NotFound();
        }
        shelter.Active = false;
        _context.SaveChanges();
        return Ok();
    }


    [HttpGet]
    [Route("eu")]
    [Authorize]
    public ActionResult<string> Read()
    {
        var id = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var nome = User.FindFirstValue(ClaimTypes.Name);
        return Ok(new { id, nome });
    }

}