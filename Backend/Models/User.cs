using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Backend.Models;

[Table("Users")]
public class User : Person
{
    public string Email { get; set; }

    [JsonIgnore]
    public byte[] PasswordHash { get; set; }

    [JsonIgnore]
    public byte[] PasswordSalt { get; set; }

    public Image? ProfilePicture { get; set; }

    public int? ImageId { get; set; }

    [JsonIgnore]
    public RefreshToken? RefreshToken { get; set; }
}