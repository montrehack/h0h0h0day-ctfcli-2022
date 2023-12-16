using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(Policy = "SantaPolicy")]
public class FlagController : ControllerBase
{
    [HttpGet(Name = "GetFlag")]
    public string Get()
    {
        return "FLAG-c821bdcf1cd786e56c518c355a97d309";
    }
}