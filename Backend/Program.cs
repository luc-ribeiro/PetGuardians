using System.Text;
using Backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Backend;

public class Program
{
    public static void Main(string[] args)
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);


        // Adiciona os Controllers da API
        builder.Services.AddControllers();

        // Configura o Cors
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

        // Pega as informações para configurar o JWT
        var jwtSection = builder.Configuration.GetSection("JWT");
        builder.Services.Configure<JWT>(jwtSection);
        var appSettings = jwtSection.Get<JWT>();

        // Configura o JWT
        var secret = Encoding.ASCII.GetBytes(appSettings.Secret);
        builder.Services.AddAuthentication(x =>
        {
            x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(x =>
        {
            x.RequireHttpsMetadata = false;
            x.SaveToken = true;
            x.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(secret),
                ValidateIssuer = false,
                ValidateAudience = false
            };
        });


        // Banco Singleton ou transient
        // builder.Services.AddDbContext<DBGame>(option => option.UseInMemoryDatabase("db"));
        
        // Banco SQL
        string strConn = builder.Configuration.GetConnectionString("BDPetGuardiansLocal");

        // Configura o Tipo de Conexão com o Banco
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

        // Usa JWT
        // app.UseAuthentication();
        // app.UseAuthorization();

        // Usa o middleware (adiciona no pipeline de execução):
        app.MapControllers();

        app.Run();
    }
}