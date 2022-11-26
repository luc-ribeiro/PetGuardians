using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Utils;
using Backend.DTO;
using Microsoft.AspNetCore.Authorization;
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
    public ActionResult<Shelter> Create(CreateShelterDto request)
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

        Shelter shelter = new Shelter
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
            RegType = 'J'
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
        var shelter = _context.Shelters.Where(s => s.Id == id && s.Active).Include(s => s.Images).Include(s => s.Donations).ThenInclude(d => d.Donor).FirstOrDefault();

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
    public ActionResult Read(string name, string uf, string city)
    {
        return Ok(_context.Shelters.Where(s => s.Name.Contains(name) && s.UF.Equals(uf) && s.City.Equals(city) && s.Active).ToList());
    }

    /// <summary>
    /// Atualiza o Abrigo
    /// </summary>
    [HttpPatch]
    [Authorize(Roles = "Shelter")]
    public async Task<ActionResult> Update([FromForm] UpdateShelterDto request)
    {
        return Ok(request);
        Shelter? _shelter = _context.Shelters.Where(s => s.Id == _userService.GetId() && s.Active).Include(s => s.Images).FirstOrDefault();
        if (_shelter == null)
        {
            return NotFound();
        }

        _shelter.CEP = request.CEP;
        _shelter.UF = request.UF;
        _shelter.City = request.City;
        _shelter.Street = request.Street;
        _shelter.StreetNumber = request.StreetNumber;
        _shelter.District = request.District;
        _shelter.Complement = request.Complement;
        _shelter.Telephone = request.Telephone;
        _shelter.Name = request.CorporateName;
        _shelter.FantasyName = request.FantasyName;
        _shelter.About = request.About;
        _shelter.KeyPIX = request.KeyPIX;

        // Remove imagens
        if (request.RemoveImagesId != null)
        {
            _shelter.Images.RemoveAll(i => request.RemoveImagesId.IndexOf(i.Id) > -1);
        }


        // Adiciona as novas imagens
        if (request.NewImages != null)
        {

            using (var memoryStream = new MemoryStream())
            {
                foreach (var file in request.NewImages)
                {
                    if (memoryStream.Length <= 0)
                    {
                        continue;
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
                    _shelter.Images.Add(image);
                }

                if (request.ProfilePicture != null && request.ProfilePicture.Length > 0)
                {
                    await request.ProfilePicture.CopyToAsync(memoryStream);

                    if (memoryStream.Length > 2097152)
                    {
                        return BadRequest("Tamanho da foto de perfil muito grande");
                    }

                    _shelter.ProfilePicture = System.Convert.ToBase64String(memoryStream.ToArray());
                    _shelter.ProfilePictureMimeType = MimeTypeMap.GetMimeType(Path.GetExtension(request.ProfilePicture.FileName));
                }
            }
        }

        _context.SaveChanges();
        return Ok();
    }

    /// <summary>
    /// Inativa um `Shelter`
    /// </summary>
    [HttpDelete]
    [Authorize(Roles = "Shelter")]
    public ActionResult Delete()
    {
        Shelter? shelter = _context.Shelters.Find(_userService.GetId());
        if (shelter == null)
        {
            return NotFound();
        }
        shelter.Active = false;
        _context.SaveChanges();
        return Ok();
    }
}