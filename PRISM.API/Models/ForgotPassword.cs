using System;
using System.Collections.Generic;

namespace PRISM.API.Models
{
    public partial class ForgotPassword
    {
        public string Email { get; set; } = null!;
        public string? Resettoken { get; set; }
    }
}
