using DAL.Services;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace RentalCarWebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class LocationsController : ControllerBase
    {
        LocationService _LocationService;

        public LocationsController(LocationService locationService)
        {
            _LocationService = locationService;
        }

        [HttpGet("")]

        public async Task<ActionResult> GetLocations([FromQuery(Name = "airportCode")] string airportCode, [FromQuery(Name = "city")] string city)
        {
            object obj = await _LocationService.GetLocations(airportCode, city);
            if(obj is List<Location>)
                return Ok(obj);
            return BadRequest(obj);
        }
    }
}
