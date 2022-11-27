namespace backend.Services
{
    public interface IEmailService
    {
        public void SendEmail(string email, string message);
    }
}