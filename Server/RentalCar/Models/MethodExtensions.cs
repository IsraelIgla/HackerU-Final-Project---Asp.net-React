using Microsoft.AspNetCore.Http;

namespace Models
{
    public static class MethodExtensions
    {
        public static string GetFileExtension(this IFormFile file) => file.FileName.Split('.').Last();
    }
}
