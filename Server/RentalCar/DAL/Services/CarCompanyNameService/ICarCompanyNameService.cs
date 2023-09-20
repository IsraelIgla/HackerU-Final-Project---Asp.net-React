using Models;

namespace DAL.Services
{
    internal interface ICarCompanyNameService
    {
        public Task<List<CarCompanyName>> GetAllCarCompanyNames();
    }
}
