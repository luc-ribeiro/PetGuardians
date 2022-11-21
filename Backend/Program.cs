using System.Text;
using Backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;

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


        // Configura o JWT
        builder.Services
           .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
           .AddJwtBearer(options =>
           {
               options.TokenValidationParameters = new TokenValidationParameters
               {
                   ValidateIssuerSigningKey = true,
                   IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("JWT:Key").Value)),
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
        builder.Services.AddSwaggerGen(options =>
        {
            options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
            {
                Description = "Cabeçalho de Autorização padrão usando o esquema Bearer (\"bearer {token}\")",
                In = ParameterLocation.Header,
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey
            });
            options.OperationFilter<SecurityRequirementsOperationFilter>(); 
        });

        WebApplication app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }


        // Usa CORS   
        app.UseCors("MyAllowSpecificOrigins");

        // Usa JWT
        app.UseAuthentication();
        app.UseAuthorization();

        // Usa o middleware (adiciona no pipeline de execução):
        app.MapControllers();

        app.Run();
    }
}