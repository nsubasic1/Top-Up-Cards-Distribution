using System.ComponentModel.DataAnnotations;

namespace backend
{
    public class Korisnik
    {
        [Key]
        public int id { get; set; }

        public string? ime { get; set; }

        public string? prezime { get; set; }

        public string email { get; set; }

        public string password { get; set; }

        public int uloga_id { get; set; }

        public int prijavljen { get; set; }

        public bool obrisan { get; set; }
        public string? resetPasswordToken { get; set; }

        public string? qrcodekey { get; set; }
        public bool usesqrcode { get; set; }
    }
}
