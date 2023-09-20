using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class CarCompanyName
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
    }
}
