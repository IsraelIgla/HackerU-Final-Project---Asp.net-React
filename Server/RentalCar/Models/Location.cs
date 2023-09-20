using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class Location
       {
        public int Id { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Country { get; set; }
        [Required]
        public string AirportCode { get; set; }
    }
}

