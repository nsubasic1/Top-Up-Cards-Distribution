using System.ComponentModel.DataAnnotations;

namespace backend
{
    public class Logs
    {
        [Key]
        public int id { get; set; }

        public string Timestamp { get; set; }

        public string Level { get; set; }

        public string Message { get; set; }
        public string? Exception { get; set; }
        public string Properties { get; set; }

    }
}
