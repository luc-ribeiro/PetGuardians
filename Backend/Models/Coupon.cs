namespace Backend.Models;

public class Coupon
{
    public int Id { get; set; }
    public string Code { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool Active { get; set; } = true;
    public Partner Partner;
    public int PartnerId;
}