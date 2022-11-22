using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Backend.Utils;
using Microsoft.EntityFrameworkCore;
using MimeTypes;
using Microsoft.AspNetCore.Authorization;
using Backend.Services.UserService;

namespace Backend.Controllers;

[ApiController]
[Route("user")]
public class UserController : ControllerBase
{
    private readonly DBPetGuardians _context;
    private readonly IConfiguration _configuration;
    private readonly IUserService _userService;

    public UserController(DBPetGuardians db, IConfiguration configuration, IUserService userService)
    {
        this._context = db;
        this._configuration = configuration;
        this._userService = userService;
    }

    [HttpPatch]
    [Route("{id}")]
    [Authorize]
    public async Task<ActionResult<string>> UpdateProfilePicture(int id, IFormFile file)
    {
        User? user = _context.Users.Find(id);

        if (user == null)
        {
            return NotFound("Usuário Inválido");
        }

        if (user.Id != _userService.GetId())
        {
            return Unauthorized();
        }

        if (file.Length <= 0)
        {
            return BadRequest("Arquivo Inválido");
        }

        using (var memoryStream = new MemoryStream())
        {
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

            // Remove a imagem antiga do usuário
            Image? currentImage = _context.Images.Find(user.ImageId);
            if (currentImage != null)
            {
                _context.Images.Remove(currentImage);
            }

            // Atualiza a imagem atual do usuário
            user.ProfilePicture = image;

            _context.SaveChanges();
            return Ok(image.Id);
        }

    }

}