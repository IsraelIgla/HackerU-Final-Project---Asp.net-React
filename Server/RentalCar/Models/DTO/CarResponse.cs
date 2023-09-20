namespace Models
{
    public class CarResponse
    {
        public Car Car { get; set; }
        public CarModel CarModel { get; set; }
        public CarCompanyName CarCompanyName { get; set; }
        public TransmissionAndDrive TransmissionAndDrive { get; set; }
        public FuelAndAC FuelAndAC { get; set; }
    }
}
