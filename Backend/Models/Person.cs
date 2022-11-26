using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models;

[Table("Persons")]
public class Person
{
    public int Id { get; set; }
    [MaxLength(60)]
    public string Name { get; set; }
    [MaxLength(11)]
    public string Telephone { get; set; }
    [MaxLength(14)]
    public string GCG { get; set; }
    [MaxLength(8)]
    public string CEP { get; set; }
    [MaxLength(2)]
    public string UF { get; set; }
    public string City { get; set; }
    public string Street { get; set; }
    public string StreetNumber { get; set; }
    public string District { get; set; }
    public string Complement { get; set; }

    [JsonIgnore]
    public DateTime Created { get; set; } = DateTime.Now;
    [JsonIgnore]
    public bool Active { get; set; } = true;
    public string Email { get; set; }
    public string? ProfilePicture { get; set; }
    public string? ProfilePictureMimeType { get; set; }
    [JsonIgnore]
    public char RegType { get; set; }
    [JsonIgnore]
    public byte[] PasswordHash { get; set; }
    [JsonIgnore]
    public byte[] PasswordSalt { get; set; }
    [JsonIgnore]
    public RefreshToken? RefreshToken { get; set; }
    public List<Image> Images { get; set; } = new List<Image>();
}
