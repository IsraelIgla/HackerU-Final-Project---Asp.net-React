using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class User
    {
        public int UserId { get; set; }
        [Required]
        [MaxLength(32)]
        public string FirstName { get; set; }
        [Required]
        [MaxLength(32)]
        public string LastName { get; set; }
        [Required]
        [MaxLength(32)]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        [MaxLength(64)]
        public string Email { get; set; }
        [Required]
        [MaxLength(32)]
        public string ImageName { get; set; }
        [Required]
        public string ImageData { get; set; }
        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpires { get; set; }
        public int RoleId { get; set; }
    }
}

