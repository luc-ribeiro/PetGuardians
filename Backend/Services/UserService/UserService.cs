using System.Security.Claims;

namespace Backend.Services.UserService;

public class UserService : IUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserService(IHttpContextAccessor httpContextAccessor)
    {
        this._httpContextAccessor = httpContextAccessor;
    }

    public int GetId()
    {
        int result = 0;
        if (_httpContextAccessor.HttpContext != null)
        {
            bool response = int.TryParse(_httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier), out result);
        }
        return result;
    }
}