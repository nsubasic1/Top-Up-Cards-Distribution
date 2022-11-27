namespace backend.Models
{
    public class Narudzba
    {
        public int id { get; set; }
        public string naziv { get; set; }
        public int pocetniId { get; set; }
        public int krajnjiId { get; set; }
        public string valuta { get; set; }
        public string vrijednost { get; set; }
        public int brojKartica { get; set; }
        public string? tip { get; set; }
    }
}
