using backend.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly DataContext _datacontext;
        private readonly Serilog.ILogger _logger;

        public RegisterController(DataContext datacontext)
        {
            _datacontext = datacontext;
            _logger = Log.Logger;
        }

        [HttpPost(Name = "register")]
        public async Task<IActionResult> register(RegisterKorisnikDTO user)
        {
            if (user == null)
            {
                return NotFound(user);
            }

            //Provjera da li postoji korisnik sa tim email vec u bazi
            var korisnici = _datacontext.korisnik.FromSqlRaw("SELECT * FROM korisnik").ToList();
            foreach (Korisnik x in korisnici)
            {
                if (x.email == user.email)
                {
                    return BadRequest("Korisnik sa ovim e-mailom vec postoji!");
                }
            }

            Korisnik korisnik = new Korisnik();
            korisnik.ime = user.ime;
            korisnik.prezime = user.prezime;   
            korisnik.email= user.email;
            korisnik.password = PasswordManager.EncodePassword(user.password);
            korisnik.uloga_id = user.rola;
            korisnik.qrcodekey = PasswordManager.GnerateRandomString();

            _datacontext.korisnik.Add(korisnik);
            await _datacontext.SaveChangesAsync();
            _logger.Information("Kreiran novi korisnik: " + user.email);
            return Ok();
        }
    }
}
