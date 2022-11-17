using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("Persons")]
public class Person
{
    public int Id { get; set; }

    [MaxLength(60)]
    public string Name { get; set; }

    [MaxLength(11)]
    public string CPF { get; set; }

    public DateTime Birthday { get; set; }

    public ICollection<Address> Addresses { get; set; }
}
