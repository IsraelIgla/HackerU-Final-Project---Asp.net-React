using Models;

namespace DAL.Services
{
    public interface ICarService
    {
        Task<int> GetCarsCount(string type, int carCompanyNameID, int carModelID, string searchText);
        Task<object> GetCars(string type, int carCompanyNameID, int carModelID, string searchText,
            int pageIndex, int carsPerPage);
        Task<object> PostCar(Car car);
        Task<object> PutCar(Car car);
        Task<bool> DeleteCar(int id);
    }
}
