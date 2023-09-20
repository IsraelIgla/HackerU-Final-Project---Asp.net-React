using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class Car
    {
        public int Id { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "ModelId value must be bigger than 0")]
        public int ModelId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Price value must be larger than 0")]
        public int PricePerDay { get; set; }

        [YearRangeFromMinTillCurrent(2000,
            "Year must be greater or equal than 2000 and less or equal then the current year")]
        public int Year { get; set; }
        [Required]
        [MaxLength(32)]
        public string ImageName { get; set; }
        [Required]
        public string ImageData { get; set; }

    }
}
