using Microsoft.AspNetCore.Http;

namespace Models
{
    public class CarWithImage : Car
    {
        public IFormFile Image { get; set; }
    }
}
