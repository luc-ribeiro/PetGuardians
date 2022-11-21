using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

public class DBPetGuardians : DbContext
{
    public DBPetGuardians(DbContextOptions<DBPetGuardians> options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Shelter>(e =>
        {
            e.Property(s => s.CorporateName).UseCollation("SQL_Latin1_General_CP1_CI_AI");
            e.HasIndex(s => s.CNPJ).IsUnique();
        });

        modelBuilder.Entity<Person>(e =>
        {
            e.Property(p => p.City).UseCollation("SQL_Latin1_General_CP1_CI_AI");
            e.Property(p => p.UF).UseCollation("SQL_Latin1_General_CP1_CI_AI");
        });
        
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
        });

        // modelBuilder.Entity<Person>()
        //     .HasMany(p => p.Addresses)
        //     .WithOne(a => a.Person)
        //     .IsRequired()
        //     .OnDelete(DeleteBehavior.Cascade);
    }

    public DbSet<Person> Persons { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Shelter> Shelters { get; set; }
}