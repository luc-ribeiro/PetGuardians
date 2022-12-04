using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("Shelters")]
public class Shelter : Person
{

    [MaxLength(60)]
    public string FantasyName { get; set; }

    public string? KeyPIX { get; set; }

    public string? About { get; set; }

    public List<Donation> Donations { get; set; } = new List<Donation>();


}