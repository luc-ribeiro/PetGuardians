using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

public class DBPetGuardians : DbContext
{
    public DBPetGuardians(DbContextOptions<DBPetGuardians> options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Person>()
            .HasMany(p => p.Addresses)
            .WithOne(a => a.Person)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
    }

    public DbSet<Person> Persons { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Shelter> Shelters { get; set; }
    public DbSet<Address> Addresses { get; set; }

    // public DbSet<Email> Games { get; set; }
    // public DbSet<Password> Quizzes { get; set; }
}