using Microsoft.Extensions.Caching.Memory;
using Models;

namespace DAL.Services
{
    public class CachedCarService : ICarService
    {
        private readonly IMemoryCache _MemoryCache;
        private readonly ICarService _CarService;

        public CachedCarService(ICarService carService, IMemoryCache memoryCache)
        {
            _CarService = carService;
            _MemoryCache = memoryCache;
        }

        public async Task<bool> DeleteCar(int id)
        {
            return await _CarService.DeleteCar(id);
        }

        public async Task<object> GetCars(string type, int carCompanyNameID, int carModelID, string searchText, int pageIndex, int carsPerPage)
        {
            var options = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromSeconds(10))
                .SetAbsoluteExpiration(TimeSpan.FromSeconds(30));

            string cacheKey = $"CarList @{type} @{carCompanyNameID} @{carModelID} @{searchText} @{pageIndex} @{carsPerPage}";

            if (_MemoryCache.TryGetValue(cacheKey, out List<Car> list))
                return list;

            object obj = await _CarService.GetCars(type, carCompanyNameID, carModelID, searchText, pageIndex, carsPerPage);

            if (obj is List<CarResponse>)
                _MemoryCache.Set(cacheKey, obj, options);

            return obj;
        }

        public async Task<int> GetCarsCount(string type, int carCompanyNameID, int carModelID, string searchText)
        {
            var options = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromSeconds(10))
                .SetAbsoluteExpiration(TimeSpan.FromSeconds(30));

            string cacheKey = $"CarsCount @{type} @{carCompanyNameID} @{carModelID} @{searchText}";

            int carsCount;
            if (_MemoryCache.TryGetValue(cacheKey, out carsCount))
                return carsCount;

            carsCount = await _CarService.GetCarsCount(type, carCompanyNameID, carModelID, searchText);
            _MemoryCache.Set(cacheKey, carsCount, options);

            return carsCount;
        }

        public async Task<object> PostCar(Car car)
        {
            return await _CarService.PostCar(car);
        }

        public async Task<object> PutCar(Car car)
        {
            return await _CarService.PutCar(car);
        }
    }
}
