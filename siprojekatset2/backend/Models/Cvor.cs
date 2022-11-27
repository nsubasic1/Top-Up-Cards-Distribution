namespace backend.Models
{
    public class Cvor
    {
        public int Id { get; set; }

        public string? title { get; set; }

        public string? subtitle { get; set; }

        public string? type { get; set; }

        public string? kasatype { get; set; }

        public string? KarticeOgranicenje { get; set; }

        public string? NovacOgranicenje { get; set; }

        public string? kasavaluta { get; set; }

        public int? kasavrijednost { get; set; }

        public string? ogr2 { get; set; }

        public string? ogr5 { get; set; }

        public string? ogr10 { get; set; }

        public string? ogr20 { get; set; }

        public string? ogr50 { get; set; }

        public string? ogr100 { get; set; }

        public string? tren2 { get; set; }

        public string? tren5 { get; set; }

        public string? tren10 { get; set; }

        public string? tren20 { get; set; }

        public string? tren50 { get; set; }

        public string? tren100 { get; set; }

        public int? ParentId { get; set; }

        public string? ChildrenId { get; set; }

        public string? korisnikemails { get; set; }

    }
}
