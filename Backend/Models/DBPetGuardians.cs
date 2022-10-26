using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

public class DBPetGuardians: DbContext {
    public DBPetGuardians(DbContextOptions<DBPetGuardians> options): base(options) {
        
    }
    public DbSet<Shelter> Shelters { get; set; }

    // public DbSet<Name> Users { get; set; }
    // public DbSet<Email> Games { get; set; }
    // public DbSet<Password> Quizzes { get; set; }


}