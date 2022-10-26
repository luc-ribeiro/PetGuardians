using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Product {
    public int Id {get; set;}

    [MaxLength(60)]
    public string Name { get; set; }

    public string Description {get; set;}

    public float Value {get; set;}

    public string Category { get; set; }

    
        
}