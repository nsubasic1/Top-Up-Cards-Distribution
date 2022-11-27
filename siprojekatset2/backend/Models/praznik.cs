namespace backend.Models
{
    public class praznik
    {
     

        public int id { get; set; }

        public string? naziv { get; set; }

        public string datumpocetni  { get; set; }
        
        public string datumkrajnji  { get; set; }
       
        public string pojacanje { get; set; }
    }
}
