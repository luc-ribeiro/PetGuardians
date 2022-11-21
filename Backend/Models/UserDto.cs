using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.Models;

public class UserDto
{
    public string Email { get; set; }

    [JsonIgnore]
    public string Password { get; set; }
}