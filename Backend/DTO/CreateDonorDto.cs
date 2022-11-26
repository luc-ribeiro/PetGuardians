using System.ComponentModel.DataAnnotations;

namespace Backend.DTO;

public class CreateDonorDto : CreatePersonDto
{

    public string FullName { get; set; }
    [MaxLength(11)]
    public string CPF { get; set; }
    public DateTime Birthday { get; set; }

}