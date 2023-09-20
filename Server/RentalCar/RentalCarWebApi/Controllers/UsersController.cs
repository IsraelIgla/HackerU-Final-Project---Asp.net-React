using DAL.Services;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace RentalCarWebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        FilesManager _FilesManager;
        UserService _UserService;

        public UsersController(FilesManager filesManager, UserService userService)
        {
            _FilesManager = filesManager;
            _UserService = userService;
        }

        [HttpGet("")]
        public async Task<ActionResult> GetAllUsers()
        {
            var users = await _UserService.GetAllUsers();
            return Ok(users);
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(User user)
        {
            object obj = await _UserService.Register(user);
            if(obj is LoginResponse)
                return Created($"/users/{user.UserId}", obj);
            return BadRequest(obj);
        }

        [HttpPost("withImage")]
        public async Task<ActionResult<User>> PostUserWithImage([FromForm] UserWithImage uwi)
        {
            var errorForImage = Utilities.CheckErrorForImage(uwi.Image, true);
            if (!string.IsNullOrEmpty(errorForImage[1])) return BadRequest(errorForImage);
            await SetImage(uwi);
            return await Register(uwi);
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(User user)
        {
            object obj = await _UserService.Login(user);
            if (obj is LoginResponse)
                return Ok(obj);
            return Unauthorized(obj);
        }

        [HttpPost("refreshToken")]
        public async Task<ActionResult> RefreshToken(TokensData td)
        {
            object obj = await _UserService.RefreshToken(td);
            if (obj is LoginResponse)
                return Ok(obj);
            return Unauthorized(obj);
        }

        #region Local functions

        async Task SetImage(UserWithImage uwi)
        {
            if (uwi.Image != null && uwi.Image.Length > 0)
            {
                ImageParams imageParams = await Utilities.GetImageParams(uwi.Image, _FilesManager);
                uwi.ImageName = imageParams.ImageName;
                uwi.ImageData = imageParams.ImageData;
            }
        }

        #endregion
    }
}
