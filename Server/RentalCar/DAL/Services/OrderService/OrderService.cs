using Microsoft.EntityFrameworkCore;
using Models;

namespace DAL.Services
{
    public class OrderService : IOrderService
    {
        RentalCarDbContext _RentalCarDbContext;

        public OrderService(RentalCarDbContext rentalCarDbContext)
        {
            _RentalCarDbContext = rentalCarDbContext;
        }

        public async Task<bool> DeleteOrder(int id)
        {
            var order = await _RentalCarDbContext.Orders.FindAsync(id);
            if (order == null)
                return false;

            _RentalCarDbContext.Orders.Remove(order);
            await _RentalCarDbContext.SaveChangesAsync();
            return true;
        }

        public async Task<object> GetOrders(int userId)
        {
            try
            {
                var db = _RentalCarDbContext;
                var q0 = db.Orders.OrderByDescending(order => order.Id).AsQueryable();
                var q1 = q0.Join(db.Users, order => order.UserId, user => user.UserId, (order, user) => new { order, user });
                var q2 = q1.Join(db.Cars, obj => obj.order.CarId, car => car.Id, (obj, car) => new { obj, car });
                var q3 = q2.Join(db.CarModels, obj => obj.car.ModelId, model => model.Id, (obj, model) => new { obj, model });
                var q4 = q3.Join(db.CarCompanyNames, obj => obj.model.CarCompanyNameId, company => company.Id,
                    (obj, company) => new { obj, company });
                var q5 = q4.Join(db.Locations, obj => obj.obj.obj.obj.order.LocationId, location => location.Id,
                    (obj, location) => new { obj, location });

                if (userId > 0)
                    q5 = q5.Where(obj => obj.obj.obj.obj.obj.user.UserId == userId);

                var result = await q5.Select(obj => new OrderResponse
                {
                    Order = obj.obj.obj.obj.obj.order,
                    User = obj.obj.obj.obj.obj.user,
                    Car = obj.obj.obj.obj.car,
                    CarModel = obj.obj.obj.model,
                    CarCompanyName = obj.obj.company,
                    Location = obj.location,
                }).ToListAsync();

                return result;
            }
            catch (Exception ex)
            {
                return ex;
            }
        }

        public async Task<string> PostOrder(Order order)
        {
            if (order.StartDate.Date < DateTime.Now.Date)
                return "start date must be greater or equal then today";
            if (order.EndDate.Date <= order.StartDate.Date)
                return "end date must be greater then start date";
            Car car = _RentalCarDbContext.Cars.Find(order.CarId);
            order.Price = car.PricePerDay * ((order.EndDate - order.StartDate).Days + 1);
            order.OrderDate = order.StartDate.Date;
            _RentalCarDbContext.Orders.Add(order);
            await _RentalCarDbContext.SaveChangesAsync();

            return string.Empty;
        }
    }
}
