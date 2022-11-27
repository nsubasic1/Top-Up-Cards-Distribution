using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class KorisnikRepository : IKorisnikRepository
    {
        private readonly DataContext _context;
        public KorisnikRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<Korisnik?> GetByEmail(string email)
        {
            return await _context.korisnik.Where(k => k.email.ToLower() == email.ToLower()).FirstOrDefaultAsync();
        }
        public async Task<Boolean> CheckEmailPasswordResetToken(string email, string token)
        {
            var korisnik = await GetByEmail(email);
            if (korisnik == null) return false;
            return korisnik.resetPasswordToken == token;
        }

        public async Task<Boolean> ChangePasswordViaEmailAndRemoveToken(string email, string newPassword)
        {
            var korisnik = await GetByEmail(email);
            if (korisnik == null) return false;

            korisnik.password = newPassword;
            korisnik.resetPasswordToken = ""; // vazno, da se ne moze iskoristiti token vise puta :)

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<String?> SetEmailPasswordResetToken(string email)
        {
            var token = Guid.NewGuid().ToString();

            var korisnik = await GetByEmail(email);
            if (korisnik == null) return null;

            korisnik.resetPasswordToken = token;
            await _context.SaveChangesAsync();

            return token;
        }
    }
}