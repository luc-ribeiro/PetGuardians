using System.ComponentModel.DataAnnotations;

namespace Backend.DTO;

public class CreateShelterDto : CreatePersonDto
{

    public string FullName { get; set; }
    public string CPF { get; set; }

    public DateTime Birthyday { get; set; }

    [MaxLength(14)]
    public string CNPJ { get; set; }

}