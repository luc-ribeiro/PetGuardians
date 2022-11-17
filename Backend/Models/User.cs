using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("Users")]
public class User: Person{
    
    public string Email {get; set; }

    public string Password {get; set;}
}