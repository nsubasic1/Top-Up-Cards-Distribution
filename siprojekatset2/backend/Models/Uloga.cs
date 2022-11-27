using System.ComponentModel.DataAnnotations;

namespace backend
{
    public class Uloga
    {
        [Key]
        public int id { get; set; }

        public string uloga { get; set; } 
    }
}
