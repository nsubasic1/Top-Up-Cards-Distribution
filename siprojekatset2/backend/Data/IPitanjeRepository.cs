using backend.Models;

namespace backend.Data
{
    public interface IPitanjeRepository
    {
        public Task<IEnumerable<Pitanje?>> GetAll();
        public Task<List<PitanjeIOdgovor?>> GetResponseByUserId(int id);
        public Task<Pitanje?> GetQuestionByText(String tekst);
        public Task<PitanjeIOdgovor?> GetResponse(String pitanje, int id);
      
    }
}