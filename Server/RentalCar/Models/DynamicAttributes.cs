using System.ComponentModel.DataAnnotations;

namespace Models
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field, AllowMultiple = false)]
    public class YearRangeFromMinTillCurrentAttribute : RangeAttribute
    {
        public YearRangeFromMinTillCurrentAttribute(int minimum, string errorMessage) :
            base(minimum, DateTime.Now.Year)
        { ErrorMessage = errorMessage; }
    }
}
