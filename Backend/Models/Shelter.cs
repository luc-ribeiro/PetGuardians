using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("Shelters")]
public class Shelter : User
{

    [MaxLength(60)]
    public string CorporateName { get; set; }

    [MaxLength(14)]
    public string CNPJ { get; set; }
    
}