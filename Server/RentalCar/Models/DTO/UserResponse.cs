namespace Models
{
    public class UserResponse
    {
     
            public int UserId { get; set; }
            public string UserName { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public int RoleID { get; set; }
            public string RoleName { get; set; }
            public UserResponse() { }
            public UserResponse(User user)
            {
                UserId = user.UserId;
                UserName = user.UserName;
                FirstName = user.FirstName;
                LastName = user.LastName;
                RoleID = user.RoleId;
                RoleName = RoleID == 1 ? "Admin" : "User";
            }
        }
}
