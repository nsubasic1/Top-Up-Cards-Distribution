using backend.Data;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace backend.Services
{
    public class JWTService : IJWTService
    {
        private readonly IConfiguration _config;
        private readonly DataContext _dataContext;

        public JWTService(IConfiguration config, DataContext dataContext)
        {
            _config = config;
            this._dataContext = dataContext;
        }

        public string Generate(Korisnik korisnik)
        {
            var kij = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_config.GetSection("JWT:Secret").Value));
            var kreds = new SigningCredentials(kij, SecurityAlgorithms.HmacSha512Signature);

            var lista = new List<Claim>
            {
                new Claim(ClaimTypes.Email, korisnik.email),
                new Claim(ClaimTypes.Role, DajRolu(korisnik)),
                new Claim(ClaimTypes.Name, korisnik.ime),
                new Claim(ClaimTypes.Surname, korisnik.prezime)
            };

            var token = new JwtSecurityToken(claims: lista, expires: DateTime.Now.AddMinutes(30), signingCredentials: kreds);
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }
        private string DajRolu(Korisnik k)
        {
            return _dataContext.uloga.First(u => u.id == k.uloga_id).uloga;
        }
    }
}
