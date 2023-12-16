using Microsoft.AspNetCore.Authorization;

namespace api.Authorization;

public static class AuthorizationExtensions
{
    public static void AddAuthorizationPolicies(this IServiceCollection services)
    {
        services.AddSingleton<IAuthorizationHandler, IsSantaHandler>();

        services.AddAuthorization(options =>
        {
            options.AddPolicy("SantaPolicy", policy =>
                policy.Requirements.Add(new IsSantaRequirement()));

            options.FallbackPolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
        });
    }
}