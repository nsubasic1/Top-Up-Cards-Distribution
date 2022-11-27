namespace backend
{
    public class KorisnikDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class KorisnikEmailPasswordResetRequestDTO
    {
        public string Email { get; set; }
    }

    public class KorisnikPasswordChangeViaEmailDTO
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }
    public class KorisnikEditProfileDTO
    {
        public string Ime { get; set; }=String.Empty;
        public string Prezime { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;

    }

}
