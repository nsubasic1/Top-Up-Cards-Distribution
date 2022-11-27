using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PraznikController : Controller

    {
        private readonly DataContext context;

        public PraznikController(DataContext datacontext)
        {
            context = datacontext;
        }

        [HttpGet("get")]
        public IEnumerable<praznik> Get()
        {
            var praznici = context.praznici.FromSqlRaw("SELECT * FROM praznici").ToList();
            return praznici;
        }

        [HttpPost("post")]
        public string post(praznik Praznik)
        {
            var praznici = context.praznici.FromSqlRaw("SELECT * FROM praznici").ToList();
            if (praznici.Any(p => p.id==Praznik.id)) return "Praznik sa id "+Praznik.id+" je već zauzet";
            context.praznici.Add(Praznik);
            context.SaveChanges();
            return "Dodan praznik "+ Praznik.id+" "+Praznik.naziv+" "+Praznik.datumpocetni+" "+Praznik.datumkrajnji+" "+Praznik.pojacanje;
        }

        [HttpDelete("delete/{id}")]
        public string delete(int id)
        {
            var praznik = context.praznici.Where(x => x.id == id).ToList();
            if(praznik.Count != 0)
            {
                context.praznici.Remove(praznik[0]);
                context.SaveChanges();
            }
            return "Obrisano";
        }
    }
}