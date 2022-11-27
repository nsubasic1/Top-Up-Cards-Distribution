namespace backend.Models
{
    public class Cvornovi
    {
        public int id { get; set; }

        public string? title { get; set; }

        public string? subtitle { get; set; }

        public string type { get; set; }

        public string karticeOgranicenje { get; set; }

        public string novacOgranicenje { get; set; }

        public string? kasatype { get; set; }

        public string? kasavaluta { get; set; }

        public int? kasavrijednost { get; set; }

        public string ogrbam { get; set; }

        public string ogreur { get; set; }

        public string ogrusd { get; set; }

        public string ogrhrk { get; set; }

        public string ogrgbp { get; set; }

        public string trenbam { get; set; }

        public string treneur { get; set; }
        
        public string trenusd { get; set; }

        public string trenhrk { get; set; }

        public string trengbp { get; set; }

        public string? korisnikemails { get; set; }

        public int? parentId { get; set; }

        public string? childrenId { get; set; }

    }
}
