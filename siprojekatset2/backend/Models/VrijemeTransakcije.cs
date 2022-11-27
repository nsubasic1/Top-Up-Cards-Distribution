using System.ComponentModel.DataAnnotations;

namespace backend
{
    public class VrijemeTransakcije
    {
        [Key]
        public int id { get; set; }

        public int idCvor { get; set; }

        public string? datum { get; set; }

        public int stanje { get; set; }

        public string trenbam { get; set; }

        public string treneur { get; set; }

        public string trenusd { get; set; }

        public string trenhrk { get; set; }

        public string trengbp { get; set; }

        public int vrijednost { get; set; }

        public string valuta { get; set; }

        public string bamvrijednosti { get; set; }

        public string eurvrijednosti { get; set; }

        public string usdvrijednosti { get; set; }

        public string hrkvrijednosti { get; set; }

        public string gbpvrijednosti { get; set; }

        public string vrsta { get; set; }



    }
}
