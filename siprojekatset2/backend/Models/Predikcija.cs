namespace backend.Models
{
    public class Predikcija
    {
        public int Id { get; set; }

        public int idCvor { get; set; }

        public string predikcijebam { get; set; }

        public string predikcijeeur { get; set; }

        public string predikcijeusd { get; set; }

        public string predikcijehrk { get; set; }

        public string predikcijegbp { get; set; }

        public bool kreirananarudzba { get; set; }
    }
}
