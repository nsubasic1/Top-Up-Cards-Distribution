using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class PitanjeRepository : IPitanjeRepository
    {
        private readonly DataContext _context;
        public PitanjeRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Pitanje?>> GetAll()
        {
            return await _context.pitanja.ToListAsync();
        }
        public async Task<List<PitanjeIOdgovor?>> GetResponseByUserId(int id)
        {
            return await _context.pitanjaiodgovori.Where(p => p.idKorisnik == id).ToListAsync();
        }
        public async Task<Pitanje?> GetQuestionByText(String tekst)
        {
            return await _context.pitanja.Where(p => p.tekst == tekst).FirstOrDefaultAsync();
        }
        public async Task<PitanjeIOdgovor?> GetResponse(String pitanje, int idKorisnika)
        {
            return await _context.pitanjaiodgovori.Where(p => p.idKorisnik == idKorisnika && p.pitanje == pitanje).FirstOrDefaultAsync();
        }
  
    }
}