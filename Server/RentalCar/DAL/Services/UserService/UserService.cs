using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Models;

namespace DAL.Services
{
    public class UserService : IUserService
    {
        TokensManager _TokensManager;
        RentalCarDbContext _RentalCarDbContext;

        public UserService(TokensManager tokensManager, RentalCarDbContext rentalCarDbContext)
        {
            _TokensManager = tokensManager;
            _RentalCarDbContext = rentalCarDbContext;
        }

        public async Task<List<User>> GetAllUsers()
        {
            return await _RentalCarDbContext.Users.ToListAsync();
        }

        public async Task<object> Login(User user)
        {
            var invalidMsg = "Invalid user name or password,  please try again.";
            var userInDb = await _RentalCarDbContext.Users.FirstOrDefaultAsync(u => u.UserName == user.UserName);
            if (userInDb == null)
                return invalidMsg;
            else
            {
                var ph = new PasswordHasher<User>();
                var result = ph.VerifyHashedPassword(userInDb, userInDb.Password, user.Password);
                if (result == PasswordVerificationResult.Failed)
                    return invalidMsg;
                else
                {
                    LoginResponse lr = new LoginResponse()
                    {
                        TokensData = GetNewTokensAndSave2DB(userInDb),
                        UserResponse = new UserResponse(userInDb)
                    };
                    return lr;
                }
            }
        }

        public async Task<object> RefreshToken(TokensData td)
        {
            var userInDb = await _RentalCarDbContext.Users.FirstOrDefaultAsync(u => u.RefreshToken == td.RefreshToken
                && u.RefreshTokenExpires > DateTime.Now);
            if (userInDb == null)
            {
                return "token invalid";
            }
            else
            {
                LoginResponse lr = new LoginResponse()
                {
                    TokensData = GetNewTokensAndSave2DB(userInDb),
                    UserResponse = new UserResponse(userInDb)
                };
                return lr;
            }
        }

        public async Task<object> Register(User user)
        {
            var userInDb = _RentalCarDbContext.Users.FirstOrDefault(u => u.UserName == user.UserName);
            if (userInDb == null)
            {
                userInDb = _RentalCarDbContext.Users.FirstOrDefault(u => u.Email == user.Email);
                if (userInDb == null)
                {
                    var ph = new PasswordHasher<User>();
                    user.Password = ph.HashPassword(user, user.Password);
                    user.RoleId = 2;// 1 - admin , 2 - user
                    _RentalCarDbContext.Users.Add(user);
                    await _RentalCarDbContext.SaveChangesAsync();
                    LoginResponse lr = new LoginResponse()
                    {
                        TokensData = GetNewTokensAndSave2DB(user),
                        UserResponse = new UserResponse(user)
                    };
                    return lr;
                }
                else
                {
                    return new string[] { "email", "A user with this Email already exists. Use a different Mail." };
                }
            }
            else
            {
                return new string[] { "username", "A user with this user name already exists. Use a different User Name." };
            }
        }

        #region Local functions

        TokensData GetNewTokensAndSave2DB(User user)
        {
            TokensData td = _TokensManager.GetInitializedTokens(user);
            //SaveCookiesToResponse(td);
            SaveRefreshToken2DB(user, td);
            return td;
        }

        void SaveRefreshToken2DB(User userInDb, TokensData td)
        {
            userInDb.RefreshToken = td.RefreshToken;
            userInDb.RefreshTokenExpires = td.RefreshTokenExpires;
            _RentalCarDbContext.SaveChanges();
        }

        #endregion
    }
}
