using System.Text.Json.Serialization;

namespace Backend.Models;

public class Image
{

    [JsonIgnore]
    public int Id { get; set; }
    public string Base64 { get; set; }
    public string MimeType { get; set; }

    [JsonIgnore]
    public float Size { get; set; }
}