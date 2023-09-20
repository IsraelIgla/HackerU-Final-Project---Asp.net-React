using DAL;
using DAL.Services;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace RentalCarWebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        RentalCarDbContext _RentalCarDbContext;
        IOrderService _OrderService;

        public OrdersController(RentalCarDbContext rentalCarDbContext, IOrderService orderService)
        {
            _RentalCarDbContext = rentalCarDbContext;
            _OrderService = orderService;
        }

        [HttpPost("postOrder")]
        public async Task<ActionResult<Order>> PostOrder([FromForm] Order order)
        {
            if (!ModelState.IsValid)
                return BadRequest("request data is invalid");

            string errorMessage = await _OrderService.PostOrder(order);
            if (string.IsNullOrEmpty(errorMessage))
                return Created("/orders/" + order.Id, order.Id);
            return BadRequest(errorMessage);
        }

        [HttpGet("")]
        //...Cars?carCompanyNameID=3&carModelID=7&pageIndex=1
        public async Task<IActionResult> GetOrders([FromQuery(Name = "userId")] int userId)
        {
            object obj = await _OrderService.GetOrders(userId);
            if (obj is List<OrderResponse>)
                return Ok(obj);
            return BadRequest(obj);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            bool result = await _OrderService.DeleteOrder(id);
            return result ? NoContent() : NotFound();
        }
    }
}
