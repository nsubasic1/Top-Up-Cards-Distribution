using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace backend.Data
{
    public class DataContext : DbContext
    {
        private readonly IConfiguration _configuration;
        public DataContext(DbContextOptions<DataContext> options, IConfiguration configuration) : base(options)
        {
            _configuration = configuration;
        }
        public DbSet<Korisnik> korisnik { get; set; }

        public DbSet<Uloga> uloga { get; set; }

        public DbSet<Pitanje> pitanja { get; set; }

        public DbSet<PitanjeIOdgovor> pitanjaiodgovori { get; set; }

        public DbSet<Logs> logs { get; set; }

        public DbSet<Cvor> cvor { get; set; }

        public DbSet<Cvornovi> cvornovi { get; set; }

        public DbSet<ValutaVrijednosti> valutavrijednosti { get; set; }

        public DbSet<Narudzba> narudzba { get; set; }

        public DbSet<VrijemeTransakcije> vrijemetransakcije  { get; set; }

        public DbSet<praznik> praznici { get; set; }

        public DbSet<RadniDani> radnidani { get; set; }

        public DbSet<RegresioniModel> regresionimodel { get; set; }

        public DbSet<Predikcija> predikcija { get; set; }

        public DbSet<Cvoratributi> cvoratributi { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySQL(_configuration.GetConnectionString("DataContext"));
        }
    }
}
