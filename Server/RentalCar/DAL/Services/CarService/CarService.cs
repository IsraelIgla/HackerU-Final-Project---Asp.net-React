using Microsoft.EntityFrameworkCore;
using Models;

namespace DAL.Services
{
    public class CarService : ICarService
    {
        FilesManager _FilesManager;
        RentalCarDbContext _RentalCarDbContext;

        public CarService(FilesManager filesManager, RentalCarDbContext rentalCarDbContext)
        {
            _FilesManager = filesManager;
            _RentalCarDbContext = rentalCarDbContext;
        }

        public async Task<bool> DeleteCar(int id)
        {
            var car = await _RentalCarDbContext.Cars.FindAsync(id);
            if (car == null)
                return false;

            _RentalCarDbContext.Cars.Remove(car);
            await _RentalCarDbContext.SaveChangesAsync();
            return true;
        }

        public async Task<object> GetCars(string type, int carCompanyNameID, int carModelID, string searchText, int pageIndex, 
            int carsPerPage)
        {
            try
            {
                if (carsPerPage < 1)
                    carsPerPage = (int)Utilities.GetValueFromConfiguration("CarsPerPage");

                var db = _RentalCarDbContext;

                var q0 = GetCarsQueryByRequestType(type);
                var q1 = q0.OrderByDescending(o => o.Id).Join(db.CarModels, v => v.ModelId, cm => cm.Id, (v, cm) => new { v, cm });
                var q2 = q1.Join(db.CarCompanyNames, o => o.cm.CarCompanyNameId, cn => cn.Id, (o, cn) => new { o, cn });
                var q3 = q2.Join(db.TransmissionAndDriveTypes, o => o.o.cm.TransmissionAndDriveID, tad => tad.Id, (o, tad) => new { o, tad });
                var q4 = q3.Join(db.FuelAndACTypes, o => o.o.o.cm.FuelAndAC_ID, faa => faa.Id, (o, faa) => new { o, faa });

                if (carCompanyNameID > 0)
                    q4 = q4.Where(o => o.o.o.cn.Id == carCompanyNameID);
                if (carModelID > 0)
                    q4 = q4.Where(o => o.o.o.o.cm.Id == carModelID);
                if (!string.IsNullOrWhiteSpace(searchText))
                {
                    searchText = searchText.ToLower().Trim();
                    q4 = q4.Where(o => o.o.o.cn.Name.ToLower().Contains(searchText) || o.o.o.o.cm.Name.ToLower().Contains(searchText));
                }

                q4 = q4.Skip(carsPerPage * (pageIndex - 1)).Take(carsPerPage);
                List<CarResponse> result = await q4.Select(o => new CarResponse
                {
                    Car = o.o.o.o.v,
                    CarModel = o.o.o.o.cm,
                    CarCompanyName = o.o.o.cn,
                    TransmissionAndDrive = o.o.tad,
                    FuelAndAC = o.faa
                }).ToListAsync();

                return result;
            }
            catch (Exception ex)
            {
                return ex;
            }
        }

        public async Task<int> GetCarsCount(string type, int carCompanyNameID, int carModelID, string searchText)
        {
            var db = _RentalCarDbContext;

            var q0 = GetCarsQueryByRequestType(type);

            var q1 = q0.Join(db.CarModels, v => v.ModelId, cm => cm.Id, (v, cm) => new { v, cm });
            var q2 = q1.Join(db.CarCompanyNames, o => o.cm.CarCompanyNameId, cn => cn.Id, (o, cn) => new { o, cn });

            if (carCompanyNameID > 0)
                q2 = q2.Where(o => o.cn.Id == carCompanyNameID);
            if (carModelID > 0)
                q2 = q2.Where(o => o.o.cm.Id == carModelID);
            if (!string.IsNullOrWhiteSpace(searchText))
            {
                searchText = searchText.ToLower().Trim();
                q2 = q2.Where(o => o.cn.Name.ToLower().Contains(searchText) || o.o.cm.Name.ToLower().Contains(searchText));
            }

            int carsCount = await q2.CountAsync();
            return carsCount;
        }

        public async Task<object> PostCar(Car car)
        {
            _RentalCarDbContext.Cars.Add(car);
            try
            {
                await _RentalCarDbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return ex;
            }

            return null;
        }

        public async Task<object> PutCar(Car car)
        {
            try
            {
                if (!CarExists(car.Id))
                    return "NotFound";
                if (car.ImageData == "nodata")
                {
                    Car _car = await _RentalCarDbContext.Cars.FindAsync(car.Id);
                    car.ImageName = _car.ImageName;
                    car.ImageData = _car.ImageData;
                }
                var local = _RentalCarDbContext.Set<Car>()
                    .Local.FirstOrDefault(entry => entry.Id.Equals(car.Id));
                if (local != null)
                    _RentalCarDbContext.Entry(local).State = EntityState.Detached;
                _RentalCarDbContext.Entry(car).State = EntityState.Modified;
                await _RentalCarDbContext.SaveChangesAsync();
                return "NoContent";
            }
            catch (Exception ex)
            {
                return ex;
            }
        }

        #region Local functions

        public IQueryable<Car> GetCarsQueryByRequestType(string type)
        {
            var db = _RentalCarDbContext;
            if (string.IsNullOrWhiteSpace(type) || type == "undefined") return db.Cars.AsQueryable();

            string[] args = type.Split(":");

            if (args.Length == 0) return db.Cars.AsQueryable();

            if (args[0] == "reservation")
            {
                args = args[1].Split(",");
                int locationId = int.Parse(args[0]);
                DateTime startDate = DateTime.Parse(args[1]);
                DateTime endDate = DateTime.Parse(args[2]);

                var q1 = db.Orders.Where(o => o.LocationId == locationId && (
                    o.StartDate <= endDate && o.EndDate >= startDate))
                    .Select(o => o.CarId);
                return db.Cars.Where(o => !q1.Contains(o.Id));
            }

            return null;
        }

        private bool CarExists(int id)
        {
            return (_RentalCarDbContext.Cars?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        async Task SetImage(CarWithImage cwi)
        {
            if (cwi.Image != null && cwi.Image.Length > 0)
            {
                ImageParams imageParams = await Utilities.GetImageParams(cwi.Image, _FilesManager);
                cwi.ImageName = imageParams.ImageName;
                cwi.ImageData = imageParams.ImageData;
            }
        }

        #endregion
    }
}
