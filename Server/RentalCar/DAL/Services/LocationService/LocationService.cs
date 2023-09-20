using Microsoft.EntityFrameworkCore;

namespace DAL.Services
{
    public class LocationService : ILocationService
    {
        RentalCarDbContext _RentalCarDbContext;

        public LocationService(RentalCarDbContext rentalCarDbContext)
        {
            _RentalCarDbContext = rentalCarDbContext;
        }

        public async Task<object> GetLocations(string airportCode, string city)
        {
            try
            {
                var db = _RentalCarDbContext;
                var locations = db.Locations.AsQueryable();

                if (!string.IsNullOrWhiteSpace(airportCode))
                    locations = locations.Where(o => o.AirportCode.ToLower().Contains(airportCode.ToLower()));

                if (!string.IsNullOrWhiteSpace(city))
                    locations = locations.Where(o => o.City.ToLower().Contains(city.ToLower()));

                var result = await locations.ToListAsync();
                return result;
            }
            catch (Exception ex)
            {
                return ex;
            }
        }
    }
}
