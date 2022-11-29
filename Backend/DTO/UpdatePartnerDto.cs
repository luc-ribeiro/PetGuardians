namespace Backend.DTO;

public class UpdatePartnerDto : UpdatePersonDto
{
    public string CorporateName { get; set; } = String.Empty;
    public string? FantasyName { get; set; } = String.Empty;
    public string? LinkSite { get; set; }
}