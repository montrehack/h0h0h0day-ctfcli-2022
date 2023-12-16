using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace api.Authorization;

public class IsSantaRequirement : IAuthorizationRequirement
{
    public IsSantaRequirement() {}
}

public class IsSantaHandler : AuthorizationHandler<IsSantaRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsSantaRequirement requirement)
    {
        Claim? clientId = context.User.FindFirst(claim => claim.Type == "client_id");
        if (clientId?.Value == "santa") {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}