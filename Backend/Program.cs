using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend;

public class Program
{
    public static void Main(string[] args)
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

        // Cria regra do CORS
        builder.Services.AddCors
        (
            option => option.AddPolicy
            (
                name: "MyAllowSpecificOrigins",
                builder =>
                {
                    builder
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowAnyOrigin();
                }
            )
        );


        // Adicionar middlewares (services):
        builder.Services.AddControllers();

        // Singleton ou transient
        // builder.Services.AddDbContext<DBGame>(option => option.UseInMemoryDatabase("db"));
        string strConn = builder.Configuration.GetConnectionString("BDPetGuardiansLocal");

        builder.Services.AddDbContext<DBPetGuardians>(option => option.UseSqlServer(strConn));

        // Adicionar o middleware Swagger:
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        WebApplication app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        // Usa o CORS   
        app.UseCors("MyAllowSpecificOrigins");

        // Usa o middleware (adiciona no pipeline de execução):
        app.MapControllers();

        app.Run();
    }
}