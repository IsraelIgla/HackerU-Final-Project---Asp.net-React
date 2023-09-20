using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class FuelAndAC
    {
        public int Id { get; set; }
        [Required]
        public string Description { get; set; }
    }
}
