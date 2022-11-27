namespace backend.Services
{
    public interface IJWTService
    {
        public string Generate(Korisnik korisnik);
    }
}
