using backend.Models;
using backend.Controllers;
using System.Diagnostics;

namespace backend.Data
{
    public class StabloUtilities
    {

        public static string? provjeriOgranicenja(Cvornovi kasa, Cvornovi prodajnoMjesto, int stanje, string valuta, int vrijednost, ValutaVrijednosti vrijednosti, List<Cvornovi> cvorovi, string tiptransakcije)
        {
            // funkcija sadrzi i sve cvorove kako bi kasnije mogli sve kase prodajnog mjesta
            Cvornovi kasa1 = new();
            kasa1.id = 3;
            kasa1.title = "Kasa";
            kasa1.subtitle = "opis";
            kasa1.type = "Kasa";
            kasa1.karticeOgranicenje = "100,2,3,4,5"; // valute
            kasa1.novacOgranicenje = "2000,2,3,4,5";
            kasa1.kasatype = "Prodajna kasa";
            kasa1.kasavaluta = "BAM";
            kasa1.kasavrijednost = 20;
            kasa1.ogrbam = "1,2,3,20,5,6"; // valuta i vrijednosti
            kasa1.ogreur = "1,2,3,4,5,6";
            kasa1.ogrusd = "1,2,3,4,5";
            kasa1.ogrhrk = "1,2,3,4,5,6";
            kasa1.ogrgbp = "1,2,3,4,5";
            kasa1.trenbam = "0,0,0,10,0,0";
            kasa1.treneur = "0,0,0,0,0,0";
            kasa1.trenusd = "0,0,0,0,0";
            kasa1.trenhrk = "0,0,0,0,0,0";
            kasa1.trengbp = "0,0,0,0,0";
            kasa1.korisnikemails = "";
            kasa1.parentId = 2;
            kasa1.childrenId = null;

            string message = null;

            var karticeOgranicenjeNiz = kasa.karticeOgranicenje.Split(",");
            var novacOgranicenjeNiz = kasa.novacOgranicenje.Split(",");

            var trenbamniz = kasa.trenbam.Split(",");
            var treneurniz = kasa.treneur.Split(",");
            var trenusdniz = kasa.trenusd.Split(",");
            var trenhrkniz = kasa.trenhrk.Split(",");
            var trengbpniz = kasa.trengbp.Split(",");
            Debug.WriteLine(kasa.kasatype);

            if (kasa.kasatype.Equals("Prodajna kasa") || kasa.kasatype.Equals("Prodajno-primajuća kasa"))
            {
                if (kasa.kasavaluta != null && !valuta.Equals(kasa.kasavaluta))
                {
                    message = "Kasa ne posjeduje datu valutu";
                    return message;
                }
                if(kasa.kasavrijednost != vrijednost)
                {
                    message = "Kasa ne podrzava vrijednosti za datu valutu";
                    return message;
                }

                var vrijednostiZaValutu = dajVrijednosti(valuta, vrijednosti).Split(",");
                var index = dajIndexNaOsnovuVrijednosti(vrijednost, vrijednostiZaValutu);

                if (index == -1)
                {
                    message = "Valuta ne podrzava zadatu vrijednost";
                    return message;
                }

                var kasa_trenutaStanjaZaValutu = dajNizNaOsnovuValute(valuta, new string[][] { trenbamniz, treneurniz, trenusdniz, trenhrkniz, trengbpniz });
                var kasa_trenutnoStanjeKase = Int32.Parse(kasa_trenutaStanjaZaValutu[index]);

                var kasa_UkupnoKarticeOgranicenje = Int32.Parse(karticeOgranicenjeNiz[getIndexValuta(valuta)]);
                var kasa_NovacOgranicenje = Int32.Parse(novacOgranicenjeNiz[getIndexValuta(valuta)]);

                // Provjera na broj kartica kase
                if (tiptransakcije.Equals("vracanje") && kasa_trenutnoStanjeKase + stanje > kasa_UkupnoKarticeOgranicenje)
                {
                    message = "Ukupan broj kartica kase prekoracen, trenutno stanje je: " + kasa_trenutnoStanjeKase + "/" + kasa_UkupnoKarticeOgranicenje;
                    return message;
                }
                else if(tiptransakcije.Equals("podizanje") && kasa_trenutnoStanjeKase - stanje < 0)
                {
                    message = "Kasa nema kartica na stanju";
                    return message;
                }

                // Provjera na novac kase
                if (tiptransakcije.Equals("vracanje") && (kasa_trenutnoStanjeKase + stanje) * vrijednost > kasa_NovacOgranicenje)
                {
                    message = "Ukupan novac kase prekoracen, trenutno stanje je: " + (kasa_trenutnoStanjeKase + stanje) * vrijednost + "/" + kasa_NovacOgranicenje;
                    return message;

                }
            }
            else
            {
                var ogrbamniz = kasa.ogrbam.Split(",");
                var ogreurniz = kasa.ogreur.Split(",");
                var ogrusdniz = kasa.ogrusd.Split(",");
                var ogrhrkniz = kasa.ogrhrk.Split(",");
                var ogrgbpniz = kasa.ogrgbp.Split(",");

                var vrijednostiZaValutu = dajVrijednosti(valuta, vrijednosti).Split(",");
                var index = dajIndexNaOsnovuVrijednosti(vrijednost, vrijednostiZaValutu);

                if(index == -1)
                {
                    message = "Valuta ne podrzava zadatu vrijednost";
                    return message;
                }

                var kasa_trenutaStanjaZaValutu = dajNizNaOsnovuValute(valuta, new string[][] { trenbamniz, treneurniz, trenusdniz, trenhrkniz, trengbpniz });
                int sum = 0;
                for(int i = 0; i < kasa_trenutaStanjaZaValutu.Length; i++)
                {
                    sum += Int32.Parse(kasa_trenutaStanjaZaValutu[i]);
                }
                var kasa_trenutnoStanjeKase = sum;

                var kasa_UkupnoKarticeOgranicenje = Int32.Parse(karticeOgranicenjeNiz[getIndexValuta(valuta)]);
                var kasa_NovacOgranicenje = Int32.Parse(novacOgranicenjeNiz[getIndexValuta(valuta)]);

                //Provjera na ukupan broja kartica kase
                if (kasa_trenutnoStanjeKase + stanje > kasa_UkupnoKarticeOgranicenje)
                {
                    message = "Ukupan broj kartica kase prekoracen, trenutno stanje je: " + kasa_trenutnoStanjeKase + "/" + kasa_UkupnoKarticeOgranicenje;
                    return message;
                }

                sum = 0;
                for (int i = 0; i < kasa_trenutaStanjaZaValutu.Length; i++)
                {
                    sum += Int32.Parse(kasa_trenutaStanjaZaValutu[i]) * Int32.Parse(vrijednostiZaValutu[i]);
                }

                // Provjera na novac kase
                if (sum + stanje * vrijednost > kasa_NovacOgranicenje)
                {
                    message = "Ukupan novac kase prekoracen, trenutno stanje je: " + sum + "/" + kasa_NovacOgranicenje;
                    return message;
                }

                var kasa_ogranicenjaZaValutu = dajNizNaOsnovuValute(valuta, new string[][] { ogrbamniz, ogreurniz, ogrusdniz, ogrhrkniz, ogrgbpniz});
                for (int i = 0; i < kasa_trenutaStanjaZaValutu.Length; i++)
                {
                    if(vrijednost == Int32.Parse(vrijednostiZaValutu[i]))
                    {
                        if(Int32.Parse(kasa_trenutaStanjaZaValutu[i]) + stanje > Int32.Parse(kasa_ogranicenjaZaValutu[i]))
                        {
                            message = "Prekoracenje kod kase ovog tipa kartice, trenutno stanje: " + kasa_trenutaStanjaZaValutu[i] + "/" + kasa_ogranicenjaZaValutu[i];
                            return message;
                        }
                    }
                }
            }

            return message;
        }

        public static int getIndexValuta(string valuta)
        {
            switch (valuta)
            {
                case "BAM": return 0;
                case "EUR": return 1;
                case "USD": return 2;
                case "HRK": return 3;
                case "GBP": return 4;
                default: return 0;
            }
        }

        public static int dajIndexNaOsnovuVrijednosti(int vrijednost, string[] nizvrijednosti)
        {
            for(int i = 0; i < nizvrijednosti.Length; i++)
            {
                if(vrijednost == Int32.Parse(nizvrijednosti[i]))
                {
                    return i;
                }
            }
            return -1;
        }

        public static string[] dajNizNaOsnovuValute(string valuta, string[][] nizovi)
        {
            switch (valuta)
            {
                case "BAM": return nizovi[0];
                case "EUR": return nizovi[1];
                case "USD": return nizovi[2];
                case "HRK": return nizovi[3];
                case "GBP": return nizovi[4];
                default: return nizovi[5];
            }
        }

        public static string dajVrijednosti(string valuta, ValutaVrijednosti valutaVrijednosti)
        {
            if (valutaVrijednosti == null)
            {
                return null;
            }
            switch (valuta)
            {
                case "BAM":
                    return valutaVrijednosti.bamvrijednosti;
                case "EUR":
                    return valutaVrijednosti.eurvrijednosti;
                case "USD":
                    return valutaVrijednosti.usdvrijednosti;
                case "HRK":
                    return valutaVrijednosti.hrkvrijednosti;
                case "GBP":
                    return valutaVrijednosti.gbpvrijednosti;
                default:
                    return valutaVrijednosti.bamvrijednosti;
            }
        }

        public static void podigniKarticeSaKase(Cvornovi kasa, PromjenaKase promjena, ValutaVrijednosti vrijednosti)
        {
            var vrijednostiZaValutu = dajVrijednosti(promjena.valuta, vrijednosti);
            var index = dajIndexNaOsnovuVrijednosti(promjena.vrijednost, vrijednostiZaValutu.Split(","));

            var trenbamniz = kasa.trenbam.Split(",");
            var treneurniz = kasa.treneur.Split(",");
            var trenusdniz = kasa.trenusd.Split(",");
            var trenhrkniz = kasa.trenhrk.Split(",");
            var trengbpniz = kasa.trengbp.Split(",");

            var temp = new string[][] { trenbamniz, treneurniz, trenusdniz, trenhrkniz, trengbpniz };
            var trenutnaStanja = dajNizNaOsnovuValute(promjena.valuta, temp);
            trenutnaStanja[index] = (Int32.Parse(trenutnaStanja[index]) - promjena.Stanje).ToString();

            for (var i = 0; i < temp.Length; i++)
            {
                var temp2 = "";
                for (var j = 0; j < temp[i].Length; j++)
                {
                    temp2 += temp[i][j];
                    if (j != temp[i].Length - 1)
                    {
                        temp2 += ",";
                    }
                }
                switch (i)
                {
                    case 0: kasa.trenbam = temp2; break;
                    case 1: kasa.treneur = temp2; break;
                    case 2: kasa.trenusd = temp2; break;
                    case 3: kasa.trenhrk = temp2; break;
                    case 4: kasa.trengbp = temp2; break;
                }
            }
        }

        public static void vratiKarticeUKasu(Cvornovi kasa, PromjenaKase promjena, ValutaVrijednosti vrijednosti)
        {
            var vrijednostiZaValutu = dajVrijednosti(promjena.valuta, vrijednosti);
            var index = dajIndexNaOsnovuVrijednosti(promjena.vrijednost, vrijednostiZaValutu.Split(","));

            var trenbamniz = kasa.trenbam.Split(",");
            var treneurniz = kasa.treneur.Split(",");
            var trenusdniz = kasa.trenusd.Split(",");
            var trenhrkniz = kasa.trenhrk.Split(",");
            var trengbpniz = kasa.trengbp.Split(",");

            var temp = new string[][] { trenbamniz, treneurniz, trenusdniz, trenhrkniz, trengbpniz };
            var trenutnaStanja = dajNizNaOsnovuValute(promjena.valuta, temp);
            trenutnaStanja[index] = (Int32.Parse(trenutnaStanja[index]) + promjena.Stanje).ToString();

            for (var i = 0; i < temp.Length; i++)
            {
                var temp2 = "";
                for (var j = 0; j < temp[i].Length; j++)
                {
                    temp2 += temp[i][j];
                    if (j != temp[i].Length - 1)
                    {
                        temp2 += ",";
                    }
                }
                switch(i)
                {
                    case 0: kasa.trenbam = temp2; break;
                    case 1: kasa.treneur = temp2; break;
                    case 2: kasa.trenusd = temp2; break;
                    case 3: kasa.trenhrk = temp2; break;
                    case 4: kasa.trengbp = temp2; break;
                }
            }
        }

        public static VrijemeTransakcije postaviVrijemeTransakcije(Cvornovi kasa, string datum, int stanje, int vrijednost, string valuta, ValutaVrijednosti vrijednosti, string vrsta)
        {
            var vrijemeTrans = new VrijemeTransakcije();
            vrijemeTrans.idCvor = kasa.id;
            vrijemeTrans.datum = datum;
            vrijemeTrans.stanje = stanje;

            vrijemeTrans.trenbam = kasa.trenbam;
            vrijemeTrans.treneur = kasa.treneur;
            vrijemeTrans.trenusd = kasa.trenusd;
            vrijemeTrans.trenhrk = kasa.trenhrk;
            vrijemeTrans.trengbp = kasa.trengbp;

            vrijemeTrans.vrijednost = vrijednost;
            vrijemeTrans.valuta = valuta;
            vrijemeTrans.vrsta = vrsta;

            vrijemeTrans.bamvrijednosti = vrijednosti.bamvrijednosti;
            vrijemeTrans.eurvrijednosti = vrijednosti.eurvrijednosti;
            vrijemeTrans.usdvrijednosti = vrijednosti.usdvrijednosti;
            vrijemeTrans.hrkvrijednosti = vrijednosti.hrkvrijednosti;
            vrijemeTrans.gbpvrijednosti = vrijednosti.gbpvrijednosti;


            return vrijemeTrans;
        }
        public static bool provjeriRadniDan(IEnumerable<RadniDani> radniDani)
        {
            int danasnjiDan = (int)DateTime.Now.DayOfWeek;
            danasnjiDan--;
            if (danasnjiDan < 0) danasnjiDan = 6;
            return radniDani.ElementAt(danasnjiDan).radni;
        }
    }
}
