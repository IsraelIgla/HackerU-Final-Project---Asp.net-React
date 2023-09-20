using Microsoft.AspNetCore.Http;

namespace Models
{
    public class UserWithImage : User
    {
        public IFormFile Image { get; set; }
    }
}
