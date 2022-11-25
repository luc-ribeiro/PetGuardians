using System.ComponentModel.DataAnnotations;

namespace Backend.DTO;

public class UpdatePersonDto
{
    [MaxLength(8)]
    public string CEP { get; set; } = String.Empty;

    [MaxLength(2)]
    public string UF { get; set; } = String.Empty;

    public string City { get; set; } = String.Empty;

    public string Street { get; set; } = String.Empty;

    public string StreetNumber { get; set; } = String.Empty;

    public string District { get; set; } = String.Empty;

    public string? Complement { get; set; } = String.Empty;

    [MaxLength(11)]
    public string Telephone { get; set; } = String.Empty;

    public IFormFile? ProfilePicture{ get; set; }

    public List<IFormFile> NewImages { get; set; } = new List<IFormFile>();

    public List<int> RemoveImagesId { get; set; } = new List<int>();
}