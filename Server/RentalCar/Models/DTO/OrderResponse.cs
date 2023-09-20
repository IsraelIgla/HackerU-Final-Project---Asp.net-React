namespace Models
{
    public class OrderResponse
    {
        public Order Order { get; set; }
        public User User { get; set; }
        public Car Car { get; set; }
        public CarModel CarModel { get; set; }
        public CarCompanyName CarCompanyName { get; set; }
        public Location Location { get; set; }
    }
}
