namespace Backend.DTO;

public class UpdateDonorDto : UpdatePersonDto
{
    public string FullName { get; set; } = String.Empty;
    public DateTime Birthday { get; set; }

}