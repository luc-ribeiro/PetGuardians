using System.ComponentModel.DataAnnotations;
namespace Backend.Models;

public class RefreshToken
{
    public string Token { get; set; } = String.Empty;
    public DateTime Created { get; set; } = DateTime.Now;
    public DateTime Expires { get; set; }

    [Key]
    public int PersonId { get; set; }
    public Person Person { get; set; }
}