namespace backend.Controllers
{
    public class RegisterKorisnikDTO
    {
        public string ime { get; set; } = String.Empty;
        public string prezime { get; set; } = String.Empty;
        public string email { get; set; } = String.Empty;
        public string password { get; set; } = String.Empty;
        public int rola { get; set; } = 2;
    }
}