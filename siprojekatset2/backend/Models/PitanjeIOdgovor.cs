using System.Text.Json.Serialization;

namespace backend.Models
{
    public class PitanjeIOdgovor
    {
        public int id { get; set; }
        public int idKorisnik { get; set; }

        public string pitanje { get; set; }        

        public string odgovor { get; set; }
    }
}
