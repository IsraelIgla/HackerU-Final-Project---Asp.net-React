using Microsoft.EntityFrameworkCore;
using Models;

namespace DAL.Services
{
    public class CarCompanyNameService : ICarCompanyNameService
    {
        RentalCarDbContext _RentalCarDbContext;

        public CarCompanyNameService(RentalCarDbContext rentalCarDbContext)
        {
            _RentalCarDbContext = rentalCarDbContext;
        }

        public async Task<List<CarCompanyName>> GetAllCarCompanyNames()
        {
            var result = await _RentalCarDbContext.CarCompanyNames.ToListAsync();
            return result;
        }
    }
}
