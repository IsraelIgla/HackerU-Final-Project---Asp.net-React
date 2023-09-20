using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Models
{
    public static class Utilities
    {
        private static IConfiguration _configuration;
        public static IConfiguration Configuration
        {
            get
            {
                var test = Directory.GetCurrentDirectory();
                var builder = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json");
                _configuration = builder.Build();
                return _configuration;
            }
        }

        public static object GetValueFromConfiguration(string key)
        {
            return Configuration.GetSection(key);
        }

        static T ConvertValue<T>(string value)
        {
            return (T)Convert.ChangeType(value, typeof(T));
        }

        public static IEnumerable<string> GetEnumerableFromConfiguration(string key)
        {
            return GetEnumerableFromConfiguration<string>(key);
        }

        public static IEnumerable<T> GetEnumerableFromConfiguration<T>(string key)
        {
            return Configuration.GetSection(key).GetChildren()
                .Select(o => ConvertValue<T>(o.Value));
        }

        public static async Task<ImageParams> GetImageParams(IFormFile image, FilesManager _FilesManager)
        {
            ImageParams imageParams = new ImageParams();
            if (image != null && image.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await image.CopyToAsync(memoryStream);
                    imageParams.ImageData = _FilesManager.GetImageString(image.FileName, memoryStream.ToArray());
                }
                imageParams.ImageName = image.FileName;
            }
            return imageParams;
        }

        static IEnumerable<string> GetImageFileExtensions()
        {
            return GetEnumerableFromConfiguration("ImageFileExtensions");
        }

        public static bool IsImage(this IFormFile file)
        {
            var imageFileExtensions = GetImageFileExtensions();
            return imageFileExtensions.Contains(file.GetFileExtension());
        }

        public static string[] CheckErrorForImage(IFormFile image, bool requireFile = false)
        {
            return new string[] { "imageError", _CheckErrorForImage(image, requireFile) };
        }

        static string _CheckErrorForImage(IFormFile image, bool requireFile = false)
        {
            if (image == null)
                return requireFile ? string.Empty : "Image not passed...";
            if (image.Length > 1000000)
                return "File size must not exceed 1MB";
            if(image.FileName.Length > 32)
            {
                return "The maximum allowed file name length is 32 characters";
            }
            if (!image.IsImage())
            {
                string extensions = GetImageFileExtensions().Aggregate((a, b) => a + ", " + b);
                return "The image file must have one of the following file extension: " + extensions;
            }
            return string.Empty;
        }

        public static bool BetweenDates(this DateTime date, DateTime start, DateTime end)
        {
            return date >= start && date <= end;
        }
    }
}
