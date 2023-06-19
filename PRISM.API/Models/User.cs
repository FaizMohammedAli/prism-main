using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PRISM.API.Models
{
    public partial class User
    {
        public User()
        {
            UserContacts = new HashSet<UserContact>();
            UserRoles = new HashSet<UserRole>();
        }

        [Key]
        public int UserId { get; set; }
        public string Username { get; set; } = null!;
        public string? Email { get; set; }
        public string Password { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public byte[] LastLoginAt { get; set; } = null!;
        public bool? Status { get; set; }
        public string? Bio { get; set; }
        public string? Avatar { get; set; }

        public virtual ICollection<UserContact> UserContacts { get; set; }
        public virtual ICollection<UserRole> UserRoles { get; set; }
    }
}
