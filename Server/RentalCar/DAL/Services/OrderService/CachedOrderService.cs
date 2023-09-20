using Microsoft.Extensions.Caching.Memory;
using Models;

namespace DAL.Services
{
    public class CachedOrderService : IOrderService
    {
        private readonly IMemoryCache _MemoryCache;
        private readonly IOrderService _OrderService;

        public CachedOrderService(IOrderService orderService, IMemoryCache memoryCache)
        {
            _OrderService = orderService;
            _MemoryCache = memoryCache;
        }

        public async Task<bool> DeleteOrder(int id)
        {
            return await _OrderService.DeleteOrder(id);
        }

        public async Task<object> GetOrders(int userId)
        {
            var options = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromSeconds(10))
                .SetAbsoluteExpiration(TimeSpan.FromSeconds(30));

            string cacheKey = $"OrderList @{userId}";

            if (_MemoryCache.TryGetValue(cacheKey, out List<Order> list))
                return list;

            object obj = await _OrderService.GetOrders(userId);

            if (obj is List<OrderResponse>)
                _MemoryCache.Set(cacheKey, obj, options);

            return obj;
        }

        public async Task<string> PostOrder(Order order)
        {
            return await _OrderService.PostOrder(order);
        }
    }
}
