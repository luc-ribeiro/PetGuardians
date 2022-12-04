using System.ComponentModel.DataAnnotations;

namespace Backend.DTO;

public class CreatePersonDto
{
    [MaxLength(8)]
    public string CEP { get; set; }

    [MaxLength(2)]
    public string UF { get; set; }

    public string City { get; set; }

    public string Street { get; set; }

    public string StreetNumber { get; set; }

    public string District { get; set; }

    public string? Complement { get; set; }

    public string Email { get; set; }

    public string Password { get; set; }

    [MaxLength(11)]
    public string Telephone { get; set; }
}