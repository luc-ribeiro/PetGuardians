using System.ComponentModel.DataAnnotations;

namespace Backend.DTO;

public class CreateShelterDto : CreatePersonDto
{

    public string CorporateName { get; set; }
    public string FantasyName { get; set; }

    [MaxLength(14)]
    public string CNPJ { get; set; }

}