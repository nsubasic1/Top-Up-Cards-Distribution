using backend.Data;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Serilog;
using System.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KorisnikController : Controller
    {
        private readonly DataContext context;
        private readonly IKorisnikRepository _korisnikRepository;
        private readonly IEmailService _emailService;
        private readonly Serilog.ILogger _logger;
        private readonly IJWTService _jwtService;
        public KorisnikController(DataContext ctx, IKorisnikRepository korisnikRepository, IEmailService emailService,IJWTService jwtService)
        {
            context = ctx;
            _korisnikRepository = korisnikRepository;
            _emailService = emailService;
            _logger = Log.Logger;
            _jwtService= jwtService;
        }

        [HttpGet("get"), Authorize(Roles = "admin")]
        public IEnumerable<Korisnik> Get()
        {
            var korisnici = context.korisnik.FromSqlRaw("SELECT * FROM korisnik").ToList();
            // Trace.WriteLine(x);
            korisnici = PasswordManager.DecodeUserListPassword(korisnici);
            return korisnici;
        }

        [HttpPost("post"), Authorize(Roles = "admin")]
        public string post()
        {
            var x = HttpContext.Request;
            Debug.WriteLine(x);
            context.korisnik.Add(new Korisnik());
            return "done";
        }
        [HttpGet("edit/{id}"), Authorize(Roles = "admin")]
        public Korisnik Edit(int id)
        {
            string upit = "SELECT * FROM korisnik WHERE id = ";
            upit = upit + id.ToString();
            var x = context.korisnik.FromSqlRaw(upit).ToArray();
            Korisnik korisnik = x[0];
            //sta vratiti ako nema nadjenog objekta ?
            return korisnik;
        }
        [HttpPost("edit/{id}"), Authorize(Roles = "admin")]
        public IActionResult Edit(int id, Korisnik korisnik)
        {
            //Provjera da li postoji korisnik sa tim email vec u bazi
            var korisnici = context.korisnik.FromSqlRaw("SELECT * FROM korisnik").ToList();
            foreach (Korisnik x in korisnici)
            {
                if(x.email == korisnik.email && x.id != id)
                {
                    return BadRequest("Korisnik sa ovim e-mailom vec postoji!");
                }
            }

            string upit = "UPDATE korisnik SET ime = '" + korisnik.ime.ToString() + "', " +
                "prezime = '" + korisnik.prezime.ToString() + "', " +
                "password = '" + PasswordManager.EncodePassword(korisnik.password.ToString()) + "', " +
                "email = '" + korisnik.email.ToString() + "' WHERE id = ";
            upit = upit + id.ToString();
            //Debug.WriteLine(upit);
            context.Database.ExecuteSqlRaw(upit);
            _logger.Information("Korisniku " + korisnik.email + " uspjesno promijenjeni podaci");
            //var x = context.korisnik.FromSqlRaw(upit);
            //Debug.WriteLine(korisnik.ime);
            return Ok();

        }
        [HttpPost("editProfile")]
        [Authorize]
        public async Task<ActionResult<Korisnik>> EditProfile(KorisnikEditProfileDTO korisnik)
        {
            
            HttpContext.Request.Headers.TryGetValue("Authorization",out var authToken);
            if (authToken.Count > 0)
            {
                var token = authToken[0].Split(" ")[1];
                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(token);
                var emailAdresa= jwtSecurityToken.Claims.First(claim => claim.Type==ClaimTypes.Email).Value;

                var tmp = await _korisnikRepository.GetByEmail(emailAdresa);
                
                if (tmp != null)
                {
                    string upit = "UPDATE korisnik SET ime = '" + korisnik.Ime.ToString() + "', " +
                            "prezime = '" + korisnik.Prezime.ToString() + "', " +
                            "email = '" + korisnik.Email.ToString() + "' WHERE email = '";

                    upit = upit + emailAdresa + "'";
                    Debug.WriteLine(upit);
                    context.Database.ExecuteSqlRaw(upit);
                    _logger.Information("Korisnik " + emailAdresa + " uspjesno ažurirao svoje podatke");
                    tmp.ime = korisnik.Ime;
                    tmp.prezime = korisnik.Prezime;
                    tmp.email = korisnik.Email;
                    return Ok(_jwtService.Generate(tmp));
                }
                
            }
            return Unauthorized();

        }
        
        [HttpPost("changePassword")]
        [Authorize]
        public async Task<ActionResult<Korisnik>> ChangePassword([FromBody] string password)
        {

            HttpContext.Request.Headers.TryGetValue("Authorization", out var authToken);
            if (authToken.Count > 0)
            {
                var token = authToken[0].Split(" ")[1];

                var handler = new JwtSecurityTokenHandler();
                var jwtSecurityToken = handler.ReadJwtToken(token);
                var emailAdresa = jwtSecurityToken.Claims.First(claim => claim.Type == ClaimTypes.Email).Value;
                
                   string upit = "UPDATE korisnik SET password = '" + PasswordManager.EncodePassword(password) + "' "  + " WHERE email = '";
                    upit = upit + emailAdresa+"'";
                    Debug.WriteLine(upit);
                    context.Database.ExecuteSqlRaw(upit);
                    _logger.Information("Korisnik " + emailAdresa + " uspjesno promijenio svoj password");
                    return Ok();
                
            }
            return Unauthorized();

        }

        [HttpGet("get_notdeleted"), Authorize(Roles = "admin")]
        public IEnumerable<Korisnik> GetNotDeleted()
        {
            var x = context.korisnik.FromSqlRaw("SELECT * FROM korisnik WHERE obrisan = 'false'").ToArray();
            return x;
        }

        [HttpPost("delete"), Authorize(Roles = "admin")]
        public string delete(Korisnik user)
        {

            if (user.obrisan == true)
                return "Nemoguce ponovo brisati obrisanog korisnika";

            string query = "UPDATE korisnik SET obrisan = 1 WHERE id = " + user.id;
            context.Database.ExecuteSqlRaw(query);
            var x = context.korisnik.FromSqlRaw("SELECT * FROM korisnik WHERE id = " + user.id).ToArray();
            if (x[0].obrisan == false) return "Korisnik " + user.ime + " " + user.prezime + " nije uspjesno obrisan";
            _logger.Information("Korisnik sa mailom " + user.email + " obrisan");
            return "Korisnik " + user.ime + " " + user.prezime + " je obrisan uspjesno";
        }

        [HttpPost("send-email-password-reset")]
        public async Task<ActionResult<string>> SendEmail(KorisnikEmailPasswordResetRequestDTO korisnikEmailPasswordResetRequestDTO)
        {
            var email = korisnikEmailPasswordResetRequestDTO.Email;
            var korisnik = await _korisnikRepository.GetByEmail(email);
            if (korisnik == null) return NotFound("Korisnik nije pronadjen.");

            var emailPasswordResetToken = await _korisnikRepository.SetEmailPasswordResetToken(email);
            var message = "Iskoristite sljedeci kod za ponovno postavljanje lozinke: " + emailPasswordResetToken;
            _emailService.SendEmail(email, message);
            return Ok("Zahtjev za ponovno postavljanje lozinke je odobren.");
        }

        [HttpPost("email-password-reset")]
        public async Task<ActionResult<string>> CheckEmailToken(KorisnikPasswordChangeViaEmailDTO korisnikPasswordChangeViaEmailDTO)
        {
            var email = korisnikPasswordChangeViaEmailDTO.Email;
            var token = korisnikPasswordChangeViaEmailDTO.Token;
            var newPassword = PasswordManager.EncodePassword(korisnikPasswordChangeViaEmailDTO.NewPassword);

            var tokenValid = await _korisnikRepository.CheckEmailPasswordResetToken(email, token);
            if (!tokenValid) return Unauthorized();
            var changedPassword = await _korisnikRepository.ChangePasswordViaEmailAndRemoveToken(email, newPassword);
            if (changedPassword)
            {
                _logger.Information("Korisniku " + email + " uspjesno promijenjen password");
                return Ok();
            }
            return BadRequest();
        }
        [HttpPut]
        [Route("updateRole"), Authorize(Roles = "admin")]
        public string UpdateRole(UlogaKorisnik uloga)
        {
            var korisnik = context.korisnik.Find(uloga.id);
            korisnik.uloga_id = uloga.uloga_id;
            context.SaveChanges();
            var naziv = context.uloga.Find(korisnik.uloga_id);
            if (naziv != null)
            {
                _logger.Information("Korisniku " + korisnik.email + " promjenjena uloga na " + naziv.uloga);
            }
            return "Update izvrsen!";
        }

        [HttpPost("postemail")]
        public IActionResult getKorisnikByEmail(KorisnikEmailPasswordResetRequestDTO email)
        {
            Korisnik korisnik;
            try
            {
                korisnik = context.korisnik.Where(k => k.email.Equals(email.Email)).First();
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok(korisnik);
        }

        [HttpPost("logout")]
        public IActionResult Logout([FromBody] String email)
        {
            _logger.Information("Korisnik " + email + " odjavljen");
            return Ok();
        }
    }
}
