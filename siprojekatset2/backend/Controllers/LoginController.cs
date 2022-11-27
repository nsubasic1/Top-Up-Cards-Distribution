using backend.Data;
using Google.Authenticator;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Serilog;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly DataContext _datacontext;
        private readonly IConfiguration _config;
        private readonly Serilog.ILogger _logger;

        public LoginController(DataContext datacontext, IConfiguration config)
        {
            _datacontext = datacontext;
            _config = config;
            _logger = Log.Logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> login(KorisnikDTO korisnik)
        {
            var nadjeni = _datacontext.korisnik.Where(k => k.email == korisnik.Email && k.password == PasswordManager.EncodePassword(korisnik.Password));
            if (!nadjeni.Any())
            {
                _logger.Information("Korisnik " + korisnik.Email + " je dobio neuspjesan pokusaj prijave");
                return BadRequest("Pogrešna email adresa ili password!");
            }
            var juzer = nadjeni.First();
            if(juzer.obrisan)
            {
                return BadRequest("Vas korisnicki racun je obrisan!");
            }
            var kij = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_config.GetSection("JWT:Secret").Value));
            var kreds = new SigningCredentials(kij, SecurityAlgorithms.HmacSha512Signature);

            var lista = new List<Claim>
            {
                new Claim(ClaimTypes.Email, juzer.email),
                new Claim(ClaimTypes.Role, DajRolu(juzer)),
                new Claim(ClaimTypes.Name, juzer.ime),
                new Claim(ClaimTypes.Surname, juzer.prezime)
            };

            var token = new JwtSecurityToken(claims: lista, expires: DateTime.Now.AddMinutes(30), signingCredentials: kreds);
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);


            _logger.Information("Korisnik " + juzer.email + " uspjesno prijavljen");


            Response.Cookies.Append("token", jwt, new CookieOptions
            {
                HttpOnly=true,
                Expires=DateTime.Now.AddMinutes(30)
            });
            return Ok(jwt);
        }

        [HttpPost("validateqrcode")]
        public async Task<IActionResult> ValidateQrCode(Korisnik korisnik)
        {
            
            var nadjeni = _datacontext.korisnik.Where(k => k.email == korisnik.email && k.password == PasswordManager.EncodePassword(korisnik.password));
            if (!nadjeni.Any())
            {
                return BadRequest("User no exist");
            }

            var pom = nadjeni.First();

            TwoFactorAuthenticator tfa = new TwoFactorAuthenticator();
            bool result = tfa.ValidateTwoFactorPIN(pom.qrcodekey, korisnik.qrcodekey);

            if (result) return Ok("valid");

            return Ok("invalid");
        }

        [HttpPost("qrcode")]
        public async Task<IActionResult> qrcode([FromBody] String email)
        {

            var user = _datacontext.korisnik.FromSqlRaw("SELECT * FROM korisnik").Where(korisnik => korisnik.email == email).ToArray()[0];
            var qrCodeKey = user.qrcodekey;

            TwoFactorAuthenticator tfa = new TwoFactorAuthenticator();
            var setupInfo = tfa.GenerateSetupCode("SI_Set2", email, qrCodeKey, false, 3);

            string qrCodeImageUrl = setupInfo.QrCodeSetupImageUrl;
            string manualEntrySetupCode = setupInfo.ManualEntryKey;

            return Ok(qrCodeImageUrl);
        }
        [HttpPost("usesqrcode")]
        public async Task<IActionResult> usesQrcode([FromBody] String email)
        {
            var user = _datacontext.korisnik.FromSqlRaw("SELECT * FROM korisnik").Where(korisnik => korisnik.email == email).ToArray()[0];

            return Ok(user.usesqrcode);
        }
        [HttpPost("switchusesqr")]
        public async Task<IActionResult> switchusesqr([FromBody] String email)
        {

            var user = _datacontext.korisnik.FromSqlRaw("SELECT * FROM korisnik").Where(korisnik => korisnik.email == email).ToArray()[0];

            if (user.usesqrcode)
            {

                string upit = "UPDATE korisnik SET usesqrcode = '0' WHERE email = '" + email + "'";
                _datacontext.Database.ExecuteSqlRaw(upit);
            }
            else
            {
                //var qrCodeKey = PasswordManager.GnerateRandomString();
                //string updateQrCodeKey = "UPDATE korisnik SET qrcodekey = '" + qrCodeKey + "' WHERE email = '" + email + "'";
                //_datacontext.Database.ExecuteSqlRaw(updateQrCodeKey);

                string switchUsesQrCodeKey = "UPDATE korisnik SET usesqrcode = '1' WHERE email = '" + email + "'";
                _datacontext.Database.ExecuteSqlRaw(switchUsesQrCodeKey);

                _datacontext.SaveChanges();
            }

            return Ok();
        }


        private string DajRolu(Korisnik k)
        {
            return _datacontext.uloga.First(u => u.id == k.uloga_id).uloga;
        }
    }
}
