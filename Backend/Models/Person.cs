using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public abstract class Person {
    public int Id {get; set;}

    [MaxLength(60)]
    public string Name { get; set; }    

    [MaxLength(14)]
    public string CPF { get; set; }    

    public DateTime Birthday { get; set; } 

    public string Email {get; set; }

    public string Password {get; set;}

    public Address? Address { get; set; }

        
}