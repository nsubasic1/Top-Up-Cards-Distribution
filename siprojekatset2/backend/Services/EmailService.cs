using System.Net;
using System.Net.Mail;

namespace backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly string _email;
        private readonly string _password;

        public EmailService(IConfiguration configuration)
        {
            _email = configuration["email"];
            _password = configuration["emailPassword"];
        }
        public void SendEmail(string email, string message)
        {
            /* using var smtpClient = new SmtpClient();
            var msg = new MimeMessage();
            msg.From.Add(new MailboxAddress("Dont Reply", _email));
            msg.To.Add(MailboxAddress.Parse(email));
            msg.Subject = "Reset your password - Dont reply";
            msg.Body = new TextPart("plain")
            {
                Text = message
            };
            smtpClient.Connect("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
            smtpClient.Authenticate(_email, _password);
            smtpClient.Send(msg);
            smtpClient.Disconnect(true);*/

            using (MailMessage Message = new MailMessage("TopUpCardsNoreply@gmail.com", email))
            {
                Message.Subject = "Password reset request";
                Message.Body = message;
                Message.IsBodyHtml = false;

                using (SmtpClient smtp = new SmtpClient("smtp.gmail.com"))
                {
                    // smtp.Host = "smpt.gmail.com";
                    smtp.EnableSsl = true;

                    NetworkCredential cred = new NetworkCredential("TopUpCardsNoreply@gmail.com", "mehmed1$");
                    smtp.UseDefaultCredentials = false;
                    smtp.Credentials = cred;
                    smtp.Port = 587;
                    smtp.Send(Message);
                }
            }
        }
    }
}