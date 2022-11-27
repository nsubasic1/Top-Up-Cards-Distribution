namespace backend.Models
{
    public class PromjenaKase
    {
        public int Id { get; set; }

        public int Stanje { get; set; }

        public string valuta { get; set; }

        public int vrijednost { get; set; }

        public string? datum { get; set; }
    }
}
