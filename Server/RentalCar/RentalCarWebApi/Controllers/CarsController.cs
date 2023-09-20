using DAL.Services;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace RentalCarWebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CarsController : ControllerBase
    {
        FilesManager _FilesManager;
        ICarService _CarService;

        public CarsController(FilesManager filesManager, ICarService carService)
        {
            _FilesManager = filesManager;
            _CarService = carService;
        }

        [HttpGet("CarsCount")]
        public async Task<IActionResult> GetCarsCount([FromQuery(Name = "type")] string type, [FromQuery(Name = "carCompanyNameID")] int carCompanyNameID,
            [FromQuery(Name = "carModelID")] int carModelID, [FromQuery(Name = "searchText")] string searchText)
        {
            int carsCount = await _CarService.GetCarsCount(type, carCompanyNameID, carModelID, searchText);
            return Ok(carsCount);
        }

        [HttpGet("")]
        //...Cars?carCompanyNameID=3&carModelID=7&pageIndex=1
        public async Task<IActionResult> GetCars([FromQuery(Name = "type")] string type, [FromQuery(Name = "carCompanyNameID")] int carCompanyNameID,
            [FromQuery(Name = "carModelID")] int carModelID, [FromQuery(Name = "searchText")] string searchText,
            [FromQuery(Name = "pageIndex")] int pageIndex, [FromQuery(Name = "carsPerPage")] int carsPerPage)
        {
            object obj = await _CarService.GetCars(type, carCompanyNameID, carModelID, searchText, pageIndex, carsPerPage);
            if (obj is List<CarResponse>)
                return Ok(obj);
            return BadRequest(obj);
        }

        [HttpPost("withImage")]
        public async Task<ActionResult<Car>> PostCarWithImage([FromForm] CarWithImage vwi)
        {
            var errorForImage = Utilities.CheckErrorForImage(vwi.Image, true);
            if (!string.IsNullOrEmpty(errorForImage[1])) return BadRequest(errorForImage);
            await SetImage(vwi);
            return await PostCar(vwi);
        }

        [HttpPost]
        public async Task<ActionResult<Car>> PostCar(Car car)
        {
            if (!ModelState.IsValid)
                return BadRequest("request data is invalid");

            var obj = await _CarService.PostCar(car);

            if(obj == null)
                return Created("/cars/" + car.Id, car.Id);
            return BadRequest(obj);
        }

        [HttpPut()]
        public async Task<IActionResult> PutCar(Car car)
        {
            var obj = await _CarService.PutCar(car);
            if (obj is Exception)
                return BadRequest(obj);
            if ((string)obj == "NotFound")
                return NotFound();

            return NoContent();
        }

        [HttpPut("withImage")]
        public async Task<IActionResult> PutCarWithImage([FromForm] CarWithImage cwi)
        {
            if (cwi.Image != null)
            {
                var errorForImage = Utilities.CheckErrorForImage(cwi.Image);
                if (!string.IsNullOrEmpty(errorForImage[1])) return BadRequest(errorForImage);
                await SetImage(cwi);
            }
            return await PutCar(cwi);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            bool result = await _CarService.DeleteCar(id);
            return result? NoContent() : NotFound();
        }

        #region Local functions

        async Task SetImage(CarWithImage cwi)
        {
            if (cwi.Image != null && cwi.Image.Length > 0)
            {
                ImageParams imageParams = await Utilities.GetImageParams(cwi.Image, _FilesManager);
                cwi.ImageName = imageParams.ImageName;
                cwi.ImageData = imageParams.ImageData;
            }
        }

        #endregion
    }
}
