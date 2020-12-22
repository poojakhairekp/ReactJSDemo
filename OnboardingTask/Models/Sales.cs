using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using OnboardingTask.Models;

namespace OnboardingTask.Models
{
    [Table("Sales")]
    public class Sales
    {
        [Key]
        [Required]
        public int Id { get; set; }
        [Required]
        public int ProductId { get; set; }
        [Required]
        public int CustomerId { get; set; }
        [Required]
        public int StoreId { get; set; }
        [Required]
        public DateTime DateSold { get; set; }

        public virtual Customer Customer{get;set;}
        public virtual Product Product { get; set; }
        public virtual Store Store { get; set; }
    }
}
