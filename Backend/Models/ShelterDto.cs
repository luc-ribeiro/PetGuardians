using System.ComponentModel.DataAnnotations;


namespace Backend.Models;

public class ShelterDto : UserDto
{
    [MaxLength(60)]
    public string Name { get; set; }

    [MaxLength(11)]
    public string CPF { get; set; }

    public DateTime Birthday { get; set; }

    [MaxLength(8)]
    public string CEP { get; set; }

    [MaxLength(2)]
    public string UF { get; set; }

    public string City { get; set; }

    public string Street { get; set; }

    public string StreetNumber { get; set; }

    public string District { get; set; }

    public string Complement { get; set; }

    [MaxLength(60)]
    public string CorporateName { get; set; }

    [MaxLength(14)]
    public string CNPJ { get; set; }

    public string? About { get; set; }
}