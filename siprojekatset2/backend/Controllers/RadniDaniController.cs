using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RadniDaniController : Controller
    {
        private readonly DataContext _datacontext;
        public RadniDaniController(DataContext ctx)
        {
            _datacontext = ctx;
        }

        [HttpGet("get")]
        public IEnumerable<RadniDani> Get()
        {
            var dani = _datacontext.radnidani.FromSqlRaw("SELECT * FROM radnidani").ToList();
            return dani;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(RadniDani danZaUpdate)
        {

            var result = await _datacontext.radnidani
                .FirstOrDefaultAsync(d => d.id == danZaUpdate.id);

            if (result != null)
            {
                result.naziv = danZaUpdate.naziv;
                result.radni = danZaUpdate.radni;

                await _datacontext.SaveChangesAsync();

                return Ok();
            }
            else 
                return NotFound(danZaUpdate);
        }
    }
}
