using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("Shelters")]
public class Shelter: Person {
    public int Id {get; set;}
 
    [MaxLength(60)]
    public string Name { get; set; }

    [MaxLength(21)]
    public string CNPJ { get; set; }
        
}