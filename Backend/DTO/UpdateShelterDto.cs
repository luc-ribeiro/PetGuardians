namespace Backend.DTO;

public class UpdateShelterDto : UpdatePersonDto
{
    public string CorporateName { get; set; } = String.Empty;
    public string FantasyName { get; set; } = String.Empty;
    public string About { get; set; } = String.Empty;
    public string KeyPIX { get; set; } = String.Empty;

}