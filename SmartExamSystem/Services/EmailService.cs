using MailKit.Net.Smtp;
using MimeKit;

namespace SmartExamSystem.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void SendEmail(
            string toEmail,
            string subject,
            string body)
        {
            var email = new MimeMessage();

            email.From.Add(
                MailboxAddress.Parse(
                    _configuration["EmailSettings:Email"]
                ));

            email.To.Add(
                MailboxAddress.Parse(toEmail)
            );

            email.Subject = subject;

            email.Body =
                new TextPart("plain")
                {
                    Text = body
                };

            using var smtp = new SmtpClient();
            // optional: force username/password auth if server offers XOAUTH2
            smtp.AuthenticationMechanisms.Remove("XOAUTH2");

            smtp.Connect(
                _configuration["EmailSettings:Host"],
                int.Parse(
                    _configuration["EmailSettings:Port"]
                ),
                MailKit.Security.SecureSocketOptions.StartTls
            );

            smtp.Authenticate(
                _configuration["EmailSettings:Email"],
                _configuration["EmailSettings:Password"]
            );

            smtp.Send(email);

            smtp.Disconnect(true);
        }
    }
}