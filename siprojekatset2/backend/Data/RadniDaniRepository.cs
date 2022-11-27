using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class RadniDaniRepository : IRadniDaniRepository
    {
        private readonly DataContext _context;

        public RadniDaniRepository(DataContext context)
        {
            _context = context;
        }

        public IEnumerable<RadniDani> GetRadniDani()
        {
            var radniDani = _context.radnidani.ToList();
            return radniDani;
        }
    }
}