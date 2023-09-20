using System.ComponentModel.DataAnnotations;

namespace Models
{
    public class CarModel
    {
        public int Id { get; set; }
        public int CarCompanyNameId { get; set; }
        [Required]
        public string Name { get; set; }
        public int NumberOfDoors { get; set; }
        public int TransmissionAndDriveID { get; set; }
        public int FuelAndAC_ID { get; set; }
        public int NumberOfPeople { get; set; }
        public int NumberOfSsuitcases { get; set; }

    }
}
