using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class Order
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "UserId value must be bigger than 0")]
        public int UserId { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "CarId value must be bigger than 0")]
        public int CarId { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "LocationId value must be bigger than 0")]
        public int LocationId { get; set; }
        public int Price { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
