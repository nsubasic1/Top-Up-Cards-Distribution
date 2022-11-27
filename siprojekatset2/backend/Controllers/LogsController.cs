using Microsoft.AspNetCore.Mvc;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogsController : ControllerBase
    {
        private readonly DataContext context;
        public LogsController(DataContext ctx)
        {
            context = ctx;
        }

        [HttpGet("get"), Authorize(Roles = "admin")]
        public IEnumerable<Logs> Get()
        {

            var logovi = context.logs.FromSqlRaw("SELECT * FROM logs").ToList();
            logovi.Reverse();
            return logovi;
        }

    }
}
