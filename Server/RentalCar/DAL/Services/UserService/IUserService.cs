using Models;

namespace DAL.Services
{
    internal interface IUserService
    {
        public Task<List<User>> GetAllUsers();
        public Task<object> Register(User user);
        public Task<object> Login(User user);
        public Task<object> RefreshToken(TokensData td);
    }
}
