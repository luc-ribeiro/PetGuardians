using Backend.Models;
using Backend.Services.UserService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("donation")]
public class DonationController : ControllerBase
{
    private readonly DBPetGuardians _context;
    private readonly IUserService _userService;

    public DonationController(DBPetGuardians context, IUserService userService)
    {
        this._context = context;
        this._userService = userService;
    }

    [HttpGet]
    [Authorize(Roles = "Donor,Shelter")]
    [Route("{id}")]
    public ActionResult<Donation> GetDonation(int id)
    {
        Donation? _donation = _context.Donations.Where(d => d.Id == id).Include(d => d.Donor).Include(d => d.Shelter).FirstOrDefault();
        if (_donation == null)
        {
            return NotFound("Doação não encontrada.");
        }
        if (_userService.GetRole() == "Donor" && _donation.DonorId != _userService.GetId())
        {
            return Unauthorized("Doação não pertence a este doador.");
        }
        if (_userService.GetRole() == "Shelter" && _donation.ShelterId != _userService.GetId())
        {
            return Unauthorized("Doação não pertence a este abrigo.");
        }
        return Ok(_donation);
    }


    [HttpPost]
    [Authorize(Roles = "Donor")]
    public ActionResult CreateDonation(int shelterId)
    {
        Shelter? _shelter = _context.Shelters.Where(s => s.Id == shelterId && s.Active).FirstOrDefault();
        if (_shelter == null)
        {
            return NotFound("Abrigo Inválido");
        }
        if (_shelter.KeyPIX == null)
        {
            return BadRequest("Abrigo não tem uma chave PIX cadastrada");
        }
        Donation _donation = new Donation
        {
            DonorId = _userService.GetId(),
            ShelterId = _shelter.Id,
            KeyPix = _shelter.KeyPIX
        };
        _context.Donations.Add(_donation);
        _context.SaveChanges();
        return Ok(_donation);
    }

    [HttpPatch]
    [Authorize(Roles = "Shelter")]
    [Route("{id}")]
    public ActionResult ApproveDonation([FromRoute] int id, [FromBody] int value)
    {
        Donation? _donation = _context.Donations.Where(d => d.Id == id && d.ShelterId == _userService.GetId()).FirstOrDefault();
        if (_donation == null)
        {
            return NotFound("Doação inválida");
        }
        _donation.Approved = true;
        _donation.ApprovedAt = DateTime.Now;
        _donation.Value = value;
        _context.SaveChanges();
        return Ok();
    }

}