using System.ComponentModel.DataAnnotations;

namespace Backend.DTO;

public class CreatePartnerDto : CreatePersonDto
{
    public string CorporateName { get; set; }
    public string FantasyName { get; set; }
    [MaxLength(14)]
    public string CNPJ { get; set; }

    public string LinkSite { get; set; }

}