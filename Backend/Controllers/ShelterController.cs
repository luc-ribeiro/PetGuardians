using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Utils;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MimeTypes;
using Microsoft.EntityFrameworkCore;
using Backend.Services.UserService;

namespace Backend.Controllers;


[ApiController]
[Route("shelter")]
public class ShelterController : ControllerBase
{
    private readonly DBPetGuardians _context;
    private readonly IUserService _userService;

    public ShelterController(DBPetGuardians db, IUserService userService)
    {
        this._context = db;
        this._userService = userService;
    }

    /// <summary>
    /// Cria um `Shelter`.
    /// </summary>
    [HttpPost]
    [AllowAnonymous]
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


    /// <summary>
    /// Consulta um `Shelter`
    /// </summary>
    [HttpGet]
    [Route("{id}")]
    [AllowAnonymous]
    public ActionResult Read(int id)
    {
        var shelter = _context.Shelters.Where(s => s.Id == id).Select(s => new
        {
            s.Id,
            s.CorporateName,
            s.CNPJ,
            s.About,
            s.Images,
            s.ProfilePicture,
            s.CEP,
            s.City,
            s.Complement,
            s.District,
            s.StreetNumber,
            s.Street,
            s.Active
        }).FirstOrDefault();

        if (shelter == null)
        {
            return NotFound();
        }
        return Ok(shelter);
    }

    /// <summary>
    /// Consulta de `Shelter` por região
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public ActionResult Read(string corporateName, string UF, string city)
    {
        return Ok(_context.Shelters.Where(s => s.CorporateName.Contains(corporateName) && s.UF.Equals(UF) && s.City.Equals(city)).ToList());
    }

    /// <summary>
    /// Atualiza `CorporateName` e `About`
    /// </summary>
    [HttpPatch]
    [Route("{id}")]
    [Authorize(Roles = "Shelter")]
    public ActionResult Update(int id, Shelter shelter)
    {
        Shelter? _shelter = _context.Shelters.Find(id);
        if (_shelter == null)
        {
            return NotFound();
        }
        if (_shelter.Id != _userService.GetId())
        {
            return Unauthorized();
        }

        _shelter.CorporateName = shelter.CorporateName;
        _shelter.About = shelter.About;
        _context.SaveChanges();
        return Ok();
    }

    /// <summary>
    /// Upload de imagens do `Shelter`
    /// </summary>
    [HttpPatch]
    [Route("{id}/images")]
    [Authorize(Roles = "Shelter")]
    public async Task<ActionResult> UploadImages(int id, List<IFormFile> files)
    {

        Shelter? shelter = _context.Shelters.Find(id);

        if (shelter == null)
        {
            return NotFound("Abrigo Inválido");
        }

        if (shelter.Id != _userService.GetId())
        {
            return Unauthorized();
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
        return Ok(shelter.Images);
    }

    /// <summary>
    /// Inativa um `Shelter`
    /// </summary>
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
        if (shelter.Id != _userService.GetId())
        {
            return Unauthorized();
        }
        shelter.Active = false;
        _context.SaveChanges();
        return Ok();
    }

    /// <summary>
    /// Exclui imagens do `Shelter`
    /// </summary>
    [HttpDelete]
    [Route("{id}/images")]
    [Authorize(Roles = "Shelter")]
    public ActionResult DeleteImages(int id, List<int> imagesIds)
    {
        Shelter? shelter = _context.Shelters.Include(s => s.Images).Where(s => s.Id == id).FirstOrDefault();
        if (shelter == null)
        {
            return NotFound();
        }
        if (shelter.Id != _userService.GetId())
        {
            return Unauthorized();
        }

        foreach (var image in shelter.Images)
        {
            if (imagesIds.IndexOf(image.Id) > -1)
            {
                _context.Images.Remove(image);
            }
        }

        _context.SaveChanges();
        return Ok(shelter.Images);
    }
}