namespace backend.Data
{
    public interface IKorisnikRepository
    {
        public Task<Korisnik?> GetByEmail(string email);
        public Task<String?> SetEmailPasswordResetToken(string email);
        public Task<Boolean> CheckEmailPasswordResetToken(string email, string token);
        public Task<Boolean> ChangePasswordViaEmailAndRemoveToken(string email, string newPassword);

    }
}