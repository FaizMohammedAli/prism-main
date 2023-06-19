using System;
using System.Collections.Generic;

namespace PRISM.API.Models
{
    public partial class UserContact
    {
        public int ContactId { get; set; }
        public int UserId { get; set; }
        public string ContactName { get; set; } = null!;
        public string ContactEmail { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual User User { get; set; } = null!;
    }
}
