using System.ComponentModel.DataAnnotations;

namespace backend
{
    public class RadniDani
    {
        [Key]
        public int id { get; set; }
        public string naziv { get; set; }
        public bool radni { get; set; }
    }
}