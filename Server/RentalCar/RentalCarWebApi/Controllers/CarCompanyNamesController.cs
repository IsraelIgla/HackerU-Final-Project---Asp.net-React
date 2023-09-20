using DAL.Services;
using Microsoft.AspNetCore.Mvc;

namespace RentalCarWebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CarCompanyNamesController : ControllerBase
    {
        CarCompanyNameService _CarCompanyNameService;

        public CarCompanyNamesController(CarCompanyNameService carCompanyNameService)
        {
            _CarCompanyNameService = carCompanyNameService;
        }

        [HttpGet("")]
        public async Task<ActionResult> GetAllCarCompanyNames()
        {
            var result = await _CarCompanyNameService.GetAllCarCompanyNames();
            return Ok(result);
        }
    }
}
