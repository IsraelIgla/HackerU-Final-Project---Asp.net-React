using Microsoft.EntityFrameworkCore;
using Models;

namespace DAL.Services
{
    public class CarModelService : ICarModelService
    {
        RentalCarDbContext _RentalCarDbContext;

        public CarModelService(RentalCarDbContext rentalCarDbContext)
        {
            _RentalCarDbContext = rentalCarDbContext;
        }

        public async Task<List<CarModel>> GetAllCarModels()
        {
            var result = await _RentalCarDbContext.CarModels.ToListAsync();
            return result;
        }

        public async Task<List<CarModel>> GetCarModelsByCarCompanyNameID(int id)
        {
            var query = _RentalCarDbContext.CarModels.AsQueryable();
            if (id > 0)
                query = query.Where(o => o.CarCompanyNameId == id);

            var result = await query.ToListAsync();
            return result;
        }
    }
}
