using backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly DataContext context;
        private static readonly string[] Summaries = new[]
        {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        public WeatherForecastController(DataContext ctx)
        {
            context = ctx;
        }

        [HttpGet(Name = "GetWeatherForecast"), Authorize(Roles = "admin")]
        public IEnumerable<WeatherForecast> Get()
        {
            Debug.WriteLine("test");
            var x = context.korisnik.FromSqlRaw("SELECT * FROM korisnik").ToList();
            var y = context.korisnik.Where(b => b.prezime.Equals("novoprezime"));
            Debug.WriteLine(x[0].password);

            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }
    }
}