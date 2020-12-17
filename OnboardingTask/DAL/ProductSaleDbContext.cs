using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OnboardingTask.Models;
using Microsoft.EntityFrameworkCore;

namespace OnboardingTask.DAL
{
    public class ProductSaleDbContext:DbContext
    {
        public DbSet<Customer> customers { get; set; }
        public ProductSaleDbContext() : base()
        {

        }
        public ProductSaleDbContext(DbContextOptions options):base(options)
        {

        }
        public DbSet<OnboardingTask.Models.Product> Product { get; set; }
        public DbSet<OnboardingTask.Models.Store> Store { get; set; }
        public DbSet<OnboardingTask.Models.Sales> Sales { get; set; }
    }
}
