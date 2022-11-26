namespace Backend.DTO;

public class UpdatePartnerDto : UpdatePersonDto
{
    public string? FantasyName { get; set; } = String.Empty;
    public string? LinkSite { get; set; }
}