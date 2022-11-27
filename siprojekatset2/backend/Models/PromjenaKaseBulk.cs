namespace backend.Models
{
    public class PromjenaKaseBulk
    {
        public int Id { get; set; }

        public string Stanje { get; set; }

        public string valuta { get; set; }

        public string vrijednost { get; set; }

        public string? datum { get; set; }

        public string vrsta { get; set; }
    }
}
