using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

public class DBPetGuardians : DbContext
{
    public DBPetGuardians(DbContextOptions<DBPetGuardians> options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Person>(e =>
        {
            e.HasIndex(p => p.GCG).IsUnique();
            e.HasIndex(p => p.Email).IsUnique();
            e.Property(p => p.Name).UseCollation("SQL_Latin1_General_CP1_CI_AI");
            e.Property(p => p.City).UseCollation("SQL_Latin1_General_CP1_CI_AI");
            e.Property(p => p.UF).UseCollation("SQL_Latin1_General_CP1_CI_AI");
            e.HasOne(p => p.RefreshToken).WithOne(rt => rt.Person).HasForeignKey<RefreshToken>(rt => rt.PersonId);
            e.HasMany(p => p.Images).WithOne(i => i.Person).HasForeignKey(i => i.PersonId);
        });
        modelBuilder.Entity<Coupon>(e =>
        {
            e.HasOne(c => c.Partner).WithMany(p => p.Coupons).HasForeignKey(c => c.PartnerId);
            e.HasIndex(c => new { c.Code, c.PartnerId }).IsUnique();
        });
        modelBuilder.Entity<Donation>(e =>
        {
            e.HasOne(d => d.Shelter).WithMany(s => s.Donations).HasForeignKey(d => d.ShelterId);
            e.HasOne(d => d.Donor).WithMany(d => d.Donations).HasForeignKey(d => d.DonorId);
        });
    }

    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Image> Images { get; set; }
    public DbSet<Person> Persons { get; set; }
    public DbSet<Shelter> Shelters { get; set; }
    public DbSet<Donor> Donors { get; set; }
    public DbSet<Partner> Partners { get; set; }
    public DbSet<Donation> Donations { get; set; }
    public DbSet<Coupon> Coupons { get; set; }
}