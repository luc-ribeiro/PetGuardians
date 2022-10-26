using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Partner {
    public int IdPartner {get; set;}

    [MaxLength(60)]
    public string Name { get; set; }

    [MaxLength(21)]
    public string CNPJ { get; set; }
        
}