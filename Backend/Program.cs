using System.Reflection;
using System.Text;
using System.Text.Json.Serialization;
using Backend.Models;
using Backend.Services.UserService;
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

        // Configura serviços
        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddHttpContextAccessor();


        // Configura o Cors
        builder.Services.AddCors
        (
            option => option.AddPolicy
            (
                name: "MyAllowSpecificOrigins",
                builder =>
                {
                    builder
                        .WithOrigins("http://127.0.0.1:5173", "http://localhost:5173")
                        .AllowCredentials()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
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


        builder.Services.AddControllers().AddJsonOptions(opt =>
        {
            opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        });



        // Banco Singleton ou transient
        // builder.Services.AddDbContext<DBGame>(option => option.UseInMemoryDatabase("db"));

        // Banco SQL
        string strConn = builder.Configuration.GetConnectionString("BDLocal");

        // Configura o Tipo de Conexão com o Banco
        builder.Services.AddDbContext<DBPetGuardians>(option => option.UseSqlServer(strConn));

        // Adicionar o middleware Swagger:
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "PetGuardiansAPI", Version = "v1" });
            options.OperationFilter<SecurityRequirementsOperationFilter>();
            var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
            var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            options.IncludeXmlComments(xmlPath);


            options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
            {
                Description = "Cabeçalho de Autorização padrão usando o esquema Bearer (\"bearer {token}\")",
                In = ParameterLocation.Header,
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey
            });
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