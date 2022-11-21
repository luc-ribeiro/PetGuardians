using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.Models;

public class UserDto
{
    public string Email { get; set; }

    public string Password { get; set; }
}