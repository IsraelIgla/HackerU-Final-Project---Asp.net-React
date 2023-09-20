using DAL;
using DAL.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Models;
using System.Text;

namespace RentalCarWebApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            string rentalCarCS = builder.Configuration.GetConnectionString("RentalCar");
            int expiresInSeconds = int.Parse(builder.Configuration.GetSection("Jwt:ExpiresInSeconds").Value);
            string key = builder.Configuration.GetSection("Jwt:Key").Value;
            string issuer = builder.Configuration.GetSection("Jwt:Issuer").Value;
            string audience = builder.Configuration.GetSection("Jwt:Audience").Value;
            string usersFilesFolder = builder.Configuration.GetSection("UsersFilesFolder").Value;

            // Add services to the container.
            builder.Services.AddSingleton<FilesManager>(new FilesManager(usersFilesFolder));
            builder.Services.AddMemoryCache();
            builder.Services.AddDbContext<RentalCarDbContext>(cfg => cfg.UseSqlServer(rentalCarCS));
            builder.Services.AddScoped<ICarService, CarService>();
            builder.Services.Decorate<ICarService, CachedCarService>();
            builder.Services.AddScoped<UserService>();
            builder.Services.AddScoped<IOrderService, OrderService>();
            builder.Services.Decorate<IOrderService, CachedOrderService>();
            builder.Services.AddScoped<LocationService>();
            builder.Services.AddScoped<CarModelService>();
            builder.Services.AddScoped<CarCompanyNameService>();
            builder.Services.AddControllers();
            builder.Services.AddLogging(configure => configure.AddConsole());
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddCors(cfg =>
            {
                cfg.AddDefaultPolicy(pol =>
                {
                    pol.AllowAnyHeader();
                    pol.AllowAnyMethod();
                    pol.AllowAnyOrigin();
                });

            });

            builder.Services.AddSingleton<TokensManager>(new TokensManager()
            {
                Issuer = issuer,
                Audience = audience,
                ExpiresInSeconds = expiresInSeconds,
                Key = key
            });
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(o =>
            {
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = issuer,
                    ValidAudience = audience,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    IssuerSigningKey = new SymmetricSecurityKey
                    (Encoding.UTF8.GetBytes(key)),
                    ValidateLifetime = true,
                    ClockSkew = System.TimeSpan.Zero,
                    ValidateIssuerSigningKey = true
                };
            });
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            app.UseCors();
            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();
            var port = app.Configuration["Port"];
            if (port != null)
                app.Run($"https://localhost:{port}");
            else
                app.Run();
        }
    }
}