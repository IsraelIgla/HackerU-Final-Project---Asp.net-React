namespace DAL.Services
{
    internal interface ILocationService
    {
        public Task<object> GetLocations(string airportCode, string city);
    }
}
