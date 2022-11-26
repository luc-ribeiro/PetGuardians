namespace Backend.Models;

public class Donation
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public int? Value { get; set; }
    public bool Approved { get; set; } = false;
    public DateTime? ApprovedAt { get; set; }
    public string KeyPix { get; set; }
    public Donor Donor;
    public int DonorId;
    public Shelter Shelter;
    public int ShelterId;
}