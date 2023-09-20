using Models;

namespace DAL.Services
{
    public interface IOrderService
    {
        public Task<string> PostOrder(Order order);
        public Task<object> GetOrders(int userId);
        public Task<bool> DeleteOrder(int orderId);
    }
}
