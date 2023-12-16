using Microsoft.OpenApi.Models;
using api.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var AllowSpecificOrigins = "_allowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme,
                  options => builder.Configuration.Bind("JwtSettings", options));

// Add cors
var origins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowSpecificOrigins,
                      policy  =>
                      {
                          policy.WithOrigins(origins)
                                .AllowAnyHeader();
                      });
});

builder.Services.AddAuthorizationPolicies();

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options => {
    options.AddSecurityDefinition("OpenId", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.OAuth2,
        Flows = new OpenApiOAuthFlows() {
            AuthorizationCode = new OpenApiOAuthFlow {
                AuthorizationUrl = new Uri(new Uri(builder.Configuration.GetSection("SwaggerAuthorization:Authority").Get<string>()), "/auth"),
                TokenUrl = new Uri(new Uri(builder.Configuration.GetSection("SwaggerAuthorization:Authority").Get<string>()), "/token")
            }
        }
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { 
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Id = "OpenId", Type = ReferenceType.SecurityScheme }
            }, 
            new List<string> { } 
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options => {
        options.OAuthClientId("santa");
        options.OAuthScopes("h0h0h0");
        options.OAuthUsePkce();
    });
}

app.UseCors(AllowSpecificOrigins);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
