using DAL.Services;
using Microsoft.AspNetCore.Mvc;

namespace RentalCarWebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CarModelsController : ControllerBase
    {
        CarModelService _CarModelService;

        public CarModelsController(CarModelService carModelService)
        {
            _CarModelService = carModelService;
        }

        [HttpGet("")]
        public async Task<ActionResult> GetAllCarModels()
        {
            var result = await _CarModelService.GetAllCarModels();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetCarModelsByCarCompanyNameID(int id)
        {
            var result = await _CarModelService.GetCarModelsByCarCompanyNameID(id);
            return Ok(result);
        }
    }
}
