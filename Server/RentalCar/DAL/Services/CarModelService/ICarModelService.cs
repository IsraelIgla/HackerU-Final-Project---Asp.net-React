using Models;

namespace DAL.Services
{
    internal interface ICarModelService
    {
        public Task<List<CarModel>> GetAllCarModels();
        public Task<List<CarModel>> GetCarModelsByCarCompanyNameID(int id);
    }
}
