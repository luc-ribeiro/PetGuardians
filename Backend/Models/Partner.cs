using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;


[Table("Partners")]
public class Partner : Person
{
    public string FantasyName { get; set; }
    public string LinkSite { get; set; }

    public List<Coupon> Coupons { get; set; } = new List<Coupon>();

}