using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Address
{
    public int Id { get; set; }

    [MaxLength(8)]
    public string CEP { get; set; }

    [MaxLength(2)]
    public string UF { get; set; }

    public string City { get; set; }

    public string Street { get; set; }

    public string Number { get; set; }

    public string District { get; set; }

    public string Complement { get; set; }

    public Person Person { get; set; }
}