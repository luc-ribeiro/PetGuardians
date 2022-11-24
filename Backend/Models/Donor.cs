using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("Donors")]
public class Donor : Person
{
    public DateTime Birthday { get; set; }
    public List<Donation> Donations { get; set; } = new List<Donation>();
}
