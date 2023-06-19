using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Microsoft.IdentityModel.Tokens;
using PRISM.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;

namespace PRISM.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class UserLoginController : ControllerBase
    {
        private readonly PRISMContext _context;
        private readonly ILogger<UserLoginController> _logger;


        public UserLoginController(PRISMContext context, ILogger<UserLoginController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<IEnumerable<User>> GetAll()
        {
            var users = _context.Users.ToList();
            return Ok(users);
        }

        [HttpPost]
        [Route("login")]
        public IActionResult Login([FromBody] LoginViewModel model)
        {
            var secretKey = _context.Users.SingleOrDefault(u => u.Email == model.Username).Email;
            var issuer = "my_issuer";
            var audience = "my_audience";
            int userId = _context.Users.SingleOrDefault(u => u.Email == model.Username).UserId;
            var username = model.Username;
            var expiresInMinutes = 60;
            var user = _context.Users.SingleOrDefault(u => u.Email == model.Username && u.Password == model.Password);

            if (user == null)
            {
                return BadRequest(new { message = "Username  & password is incorrect" });
            }
            CreatePasswordHash(model.Password, out byte[] passwordHash, out byte[] passwordSalt);
            if (!VerifyPasswordHash(model.Password, passwordHash, passwordSalt))
            {
                return BadRequest(new { message = "Password is incorrect" });
            }

            // Generate JWT token and return it in response
            var token = GenerateJwtToken(secretKey, issuer, audience, userId, username, expiresInMinutes);
            saveResetToken(secretKey, token);
            return Ok(new { token });
        }

        [HttpPost]
        [Route("CreateUser")]
        public IActionResult Post(User model)
        {
            _context.Users.Add(model);
            return Ok(model);
        }

        [HttpPost]
        [Route("ForgotPassword")]
        public ActionResult ForgotPassword(string email, string newpassword)
        {
            // Check if the email address exists in the database
            if (_context.Users.SingleOrDefault(x => x.Email == email).Email != email)
            {
                // Return an error message if the email address does not exist
                return BadRequest("Email address not found.");
            }
            else
            {
                var secretKey = email;
                var issuer = "my_issuer";
                var audience = "my_audience";
                int userId = _context.Users.SingleOrDefault(u => u.Email == email).UserId;
                var username = _context.Users.SingleOrDefault(u => u.Email == email).Username;
                var expiresInMinutes = 60;

                // Generate a new password reset token and save it to the database
                string resetToken = GenerateJwtToken(secretKey, issuer, audience, userId, username, expiresInMinutes);

                // Send an email to the user with a link to the password reset page and the reset token
                if (saveResetToken(email, resetToken))
                {
                    //  sendResetEmail(email, resetToken); 
                 var users= _context.Users.SingleOrDefault(x => x.Email == email);
                    users.Password   = newpassword;
                    _context.SaveChanges();
                    return Ok("Password reset successfully");
                }

                // Return a success message
                return BadRequest();
            }
        }

        //[HttpPost]
        //[Route("ValidateToken")]
        //public ActionResult ValidateToken(string email, string resetToken, string password)
        //{
        //    if (_context.ForgotPasswords.SingleOrDefault(x => x.Email == email).Resettoken == resetToken)
        //    {
        //        _context.Users.SingleOrDefault(x => x.Email == email).Password = password;
        //        _context.UpdateRange();
        //    }
        //    return Ok();
        //    return BadRequest();
        //}

        private void sendResetEmail(string email, string resetToken)
        {

            try
            {
                // Define the email body with a link to the password reset page and the reset token
                string resetLink = "https://example.com/reset-password?email=" + email + "&token=" + resetToken;
                string emailBody = "Hello,\n\nPlease click the following link to reset your password:\n\n" + resetLink;


                //string url = "https://api.sendinblue.com/v3/emailCampaigns";
                //string apiKey = "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";


                //using (var client = new HttpClient())
                //{
                //    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("api-key", apiKey);

                //    var campaignSettings = new
                //    {
                //        name = "Password Reset Request",
                //        subject = "Password Reset Request",
                //        sender = new { name = "PRISM TEAM", email = "manish.prism.sapient@gmail.com" },
                //        type = "classic",
                //    };

                //    var content = new
                //    {
                //        campaignSettings,
                //        htmlContent = emailBody,
                //        recipients = new { listIds = new[] { email } }

                //    };

                //    var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(content), Encoding.UTF8, "application/json");
                //    var response = client.PostAsync(url, jsonContent);


                //}

                // Create a new MailMessage object
                MailMessage message = new MailMessage();

                // Set the sender's email address
                message.From = new MailAddress("manish.prism.sapient@gmail.com");

                // Set the recipient's email address
                message.To.Add(email);

                // Set the email subject
                message.Subject = "Password Reset Request";

                // Set the email body
                message.Body = emailBody;

                // Set the email's priority to high
                message.Priority = MailPriority.High;

                // Create a new SmtpClient object
                SmtpClient smtpClient = new SmtpClient();

                // Set the SMTP server name and port number
                smtpClient.Host = "smtp.gmail.com";
                smtpClient.Port = 587;

                // Enable SSL encryption
                smtpClient.EnableSsl = true;

                // Set the SMTP credentials (if required)
                smtpClient.Credentials = new NetworkCredential("manish.prism.sapient@gmail.com", "Aa123456!@");

                // Send the email
                smtpClient.Send(message);
            }
            catch (Exception ex)
            {
                // Handle any errors that occur while sending the email
                Console.WriteLine("Error sending email: " + ex.Message);
            }

        }

        private bool saveResetToken(string email, string resetToken)
        {
            try
            {
                var pass = _context.ForgotPasswords.SingleOrDefault(x => x.Email == email);
                    pass.Resettoken = resetToken;
                    _context.SaveChanges();
                
            }
            catch (Exception ex)
            {
                // Handle any errors that occur while sending the email
                Console.WriteLine(BadRequest("Error sending in setting new token"));

            }
            return true;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException(nameof(password));
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", nameof(password));

            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        public static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException(nameof(password));
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", nameof(password));
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", nameof(storedHash));
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", nameof(storedSalt));

            using (var hmac = new HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }

            return true;
        }

        public static string GenerateJwtToken(string secretKey, string issuer, string audience, int userId, string username, int expiresInMinutes)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim("userId", userId.ToString()),
            new Claim("username", username)
        }),
                Expires = DateTime.UtcNow.AddMinutes(expiresInMinutes),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}