using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Diagnostics;
using System.Globalization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StabloController : Controller
    {
        private readonly DataContext _context;
        private readonly Serilog.ILogger _logger;
        private IRadniDaniRepository _radniDaniRepository;
        public StabloController(DataContext ctx,IRadniDaniRepository radniDaniRepository)
        {
            _context = ctx;
            _logger = Log.Logger;
            _radniDaniRepository = radniDaniRepository;
        }

        [HttpGet("getnovi")]
        public List<Cvornovi> GetNovi()
        {
            var SviCvorovi = _context.cvornovi.ToList();
            return SviCvorovi;
        }

        [HttpPost("postnovi")]
        public async Task<IActionResult> SaveTreeNew(List<Cvornovi> cvorovi)
        {
            _context.Database.ExecuteSqlRaw("DELETE FROM cvornovi");
            _context.cvornovi.AddRange(cvorovi);
            _context.SaveChanges();
            return Ok("Uspjesno spaseno");
        }

        /* [HttpPost("post")]
        public async Task<IActionResult> SaveTree(List<Cvor> cvorovi)
        {
            _context.Database.ExecuteSqlRaw("DELETE FROM cvor");
            _context.Database.ExecuteSqlRaw("ALTER TABLE cvor AUTO_INCREMENT = 1");
            _context.cvor.AddRange(cvorovi);
            _context.SaveChanges();
            return Ok("Uspjesno spaseno");
        }*/

        [HttpGet("vrijednosti")]
        public ValutaVrijednosti GetVrijednosti()
        {
            return _context.valutavrijednosti.First();
        }

        [HttpPost("vrijednostipost")]
        public async Task<IActionResult> SaveVrijednosti(ValutaVrijednosti valutaVrijednosti)
        {
            var stari = _context.valutavrijednosti.Find(1);
            stari.bamvrijednosti = valutaVrijednosti.bamvrijednosti;
            stari.eurvrijednosti = valutaVrijednosti.eurvrijednosti;
            stari.usdvrijednosti = valutaVrijednosti.usdvrijednosti;
            stari.hrkvrijednosti = valutaVrijednosti.hrkvrijednosti;
            stari.gbpvrijednosti = valutaVrijednosti.gbpvrijednosti;
            _context.SaveChanges();
            return Ok("Promjene spasene!");
        } 

        /* [HttpGet("vrijednosti/post")]
        public async Task<IActionResult> PostVrijednosti(string bam, string eur, string usd, string hrk, string gbp)
        {
            var rez = await _context.valutavrijednosti.FirstAsync();
            rez.bamvrijednosti = bam;
            rez.eurvrijednosti = eur;
            rez.usdvrijednosti = usd;
            rez.hrkvrijednosti = hrk;
            rez.gbpvrijednosti = gbp;
            await _context.SaveChangesAsync();
            return Ok();
        }*/

        [HttpGet("getNarudzbe")]
        public List<Narudzba> GetNarudzbe()
        {
            var sveNarduzbe = _context.narudzba.ToList();
            sveNarduzbe.Reverse();
            return sveNarduzbe;
        }

        [HttpGet("getTransakcije")]
        public List<VrijemeTransakcije> GetTransakcije()
        {
            var sveTransakcije = _context.vrijemetransakcije.ToList();
            sveTransakcije.Reverse();
            return sveTransakcije;
        }

        [HttpGet("getNazivCvora")]
        public string GetNazivCvora(int id)
        {
            var SviCvorovi = _context.cvor.ToList();
            var naziv = SviCvorovi[id - 1].title;
            return naziv;
        }

        [HttpGet("getCvoroviParentId/{id}")]
        public List<Cvornovi> GetCvoroviFromParentId(int id)
        {
            var cvorovi = _context.cvornovi.FromSqlRaw("SELECT * FROM cvornovi WHERE ParentId = " + id).ToList();
            return cvorovi;
        }
        [HttpGet("getNodeFromId/{id}")]
        public Cvornovi getNodeFromId(int id)
        {
            var parent = _context.cvornovi.FromSqlRaw("SELECT * FROM cvornovi WHERE id = " + id).ToArray();
            return parent[0];
        }

        [HttpPost("postNarudzbe")]
        public string postNarudzbe(List<Narudzba> n)
        {
            _context.narudzba.AddRange(n);
            _context.SaveChanges();
            return "Narudžba poslana";
        }

        [HttpPost("postVrijemeTransakcije")]
        public string postVrijemeTransakcije(VrijemeTransakcije vt)
        {
            _context.vrijemetransakcije.Add(vt);
            _context.SaveChanges();
            return "Vrijeme transakcije spašeno";
        }


        [HttpPost("podigni")]
        public async Task<IActionResult> podigniKarticu(PromjenaKase promjena)
        {
            var cvorovi = GetNovi();
            var vrijemeTrans = new VrijemeTransakcije();
            var dani = _radniDaniRepository.GetRadniDani();
            if (!StabloUtilities.provjeriRadniDan(dani))
            {
                return BadRequest("Dan je neradni!");
            }
            var kasa = cvorovi.Find(x => x.id == promjena.Id);
            if (kasa == null)
            {
                return BadRequest("Cvor sa datim id-em ne postoji");
            }
            if (kasa.kasatype == null)
            {
                return BadRequest("Dati cvor nije kasa");
            }
            if (!kasa.kasatype.Equals("Prodajna kasa") && !kasa.kasatype.Equals("Prodajno-primajuća kasa"))
            {
                return BadRequest("Dati tip kase ne podržaje podizanje kartica");
            }
            var parent = cvorovi.Find(x => x.id == kasa.parentId);
            var vrijednosti = GetVrijednosti();
            //string message = null;
            var message = StabloUtilities.provjeriOgranicenja(kasa, parent, promjena.Stanje, promjena.valuta, promjena.vrijednost, vrijednosti, cvorovi, "podizanje");
            if (message == null)
            {
                StabloUtilities.podigniKarticeSaKase(kasa, promjena, vrijednosti);
                _context.SaveChanges();
                if (promjena.datum == null)
                {
                    vrijemeTrans = StabloUtilities.postaviVrijemeTransakcije(kasa, DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss"), promjena.Stanje, promjena.vrijednost, promjena.valuta, vrijednosti, "podizanje");
                }
                else
                {
                    vrijemeTrans = StabloUtilities.postaviVrijemeTransakcije(kasa, promjena.datum, promjena.Stanje, promjena.vrijednost, promjena.valuta, vrijednosti, "podizanje");
                }
                postVrijemeTransakcije(vrijemeTrans);
                return Ok("Kasa azurirana");
            }
            else
            {
                return BadRequest(message);
            }
        }

        [HttpPost("vrati")]
        public async Task<IActionResult> vratiKartice(PromjenaKase promjena)
        {
            var cvorovi = GetNovi();
            var vrijemeTrans = new VrijemeTransakcije();
            var dani = _radniDaniRepository.GetRadniDani();
            if (!StabloUtilities.provjeriRadniDan(dani))
            {
                return BadRequest("Dan je neradni!");
            }
            var kasa = cvorovi.Find(x => x.id == promjena.Id);
            if (kasa == null)
            {
                return BadRequest("Cvor sa datim id-em ne postoji");
            }
            if (kasa.kasatype == null)
            {
                return BadRequest("Dati cvor nije kasa");
            }
            if (!kasa.kasatype.Equals("Primajuća kasa") && !kasa.kasatype.Equals("Prodajno-primajuća kasa"))
            {
                return BadRequest("Dati tip kase ne podrzava vracanje kartica");
            }

            var parent = cvorovi.Find(x => x.id == kasa.parentId);
            var vrijednosti = GetVrijednosti();
            //string message = null;
            var message = StabloUtilities.provjeriOgranicenja(kasa, parent, promjena.Stanje, promjena.valuta, promjena.vrijednost, vrijednosti, cvorovi, "vracanje");

            if (message == null)
            {
                StabloUtilities.vratiKarticeUKasu(kasa, promjena, vrijednosti);
                _context.SaveChanges();
                if (promjena.datum == null)
                {
                    vrijemeTrans = StabloUtilities.postaviVrijemeTransakcije(kasa, DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss"), promjena.Stanje, promjena.vrijednost, promjena.valuta, vrijednosti, "vracanje");
                }
                else
                {
                    vrijemeTrans = StabloUtilities.postaviVrijemeTransakcije(kasa, promjena.datum, promjena.Stanje, promjena.vrijednost, promjena.valuta, vrijednosti, "vracanje");
                }
                postVrijemeTransakcije(vrijemeTrans);
                return Ok("Kasa azurirana");
            }
            else
            {
                return BadRequest(message);
            }
        }

        [HttpPost("vratiostecene")]
        public async Task<IActionResult> vratiOsteceneKartice(PromjenaKase promjena)
        {
            var cvorovi = GetNovi();
            var vrijemeTrans = new VrijemeTransakcije();
            var dani = _radniDaniRepository.GetRadniDani();
            if (!StabloUtilities.provjeriRadniDan(dani))
            {
                return BadRequest("Dan je neradni!");
            }
            var kasa = cvorovi.Find(x => x.id == promjena.Id);

            if (kasa == null)
            {
                return BadRequest("Cvor sa datim id-em ne postoji");
            }

            if (kasa.kasatype == null)
            {
                return BadRequest("Dati cvor nije kasa");
            }

            if (!kasa.kasatype.Equals("Kasa za oštećene kartice"))
            {
                return BadRequest("Dati tip kase ne podrzaje vracanje ostecenih kartica");
            }

            var parent = cvorovi.Find(x => x.id == kasa.parentId);
            var vrijednosti = GetVrijednosti();
            //string message = null;
            var message = StabloUtilities.provjeriOgranicenja(kasa, parent, promjena.Stanje, promjena.valuta, promjena.vrijednost, vrijednosti, cvorovi, "vracanje");

            if (message == null)
            {
                StabloUtilities.vratiKarticeUKasu(kasa, promjena, vrijednosti);
                _context.SaveChanges();
                if (promjena.datum == null)
                {
                    vrijemeTrans = StabloUtilities.postaviVrijemeTransakcije(kasa, DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss"), promjena.Stanje, promjena.vrijednost, promjena.valuta, vrijednosti, "vracanje");
                }
                else
                {
                    vrijemeTrans = StabloUtilities.postaviVrijemeTransakcije(kasa, promjena.datum, promjena.Stanje, promjena.vrijednost, promjena.valuta, vrijednosti, "vracanje");
                }
                postVrijemeTransakcije(vrijemeTrans);
                return Ok("Kasa azurirana");
            }
            else
            {
                return BadRequest(message);
            }

        }
        [HttpGet("getVrijemeTransakcijeByIdCvor/{id}")]
        public List<VrijemeTransakcije> getVrijemeTransakcijeByIdCvor(int id)
        {

            var rez = _context.vrijemetransakcije.FromSqlRaw("SELECT * FROM vrijemetransakcije WHERE idCvor = " + id).ToList();
            return rez;
        }

        [HttpGet("getStanja/{id}/{pocetakDana}/{krajDana}")]
        public List<VrijemeTransakcije> getStanja(int id, string pocetakDana, string krajDana)
        {
            var pocetnoStanje = _context.vrijemetransakcije.FromSqlRaw("SELECT vt.* FROM vrijemetransakcije vt WHERE vt.idCvor = " + id + " AND vt.datum = (SELECT MAX(vt2.datum) FROM vrijemetransakcije vt2 WHERE vt2.idCvor = " + id + " AND vt2.datum " + "<=" + ' ' + '\'' + pocetakDana + '\'' + ")").ToList();
            var krajnjeStanje = _context.vrijemetransakcije.FromSqlRaw("SELECT vt.* FROM vrijemetransakcije vt WHERE vt.idCvor = " + id + " AND vt.datum = (SELECT MAX(vt2.datum) FROM vrijemetransakcije vt2 WHERE vt2.idCvor = " + id + " AND vt2.datum " + '<' + ' ' + '\'' + krajDana + '\'' + ")").ToList();
            
            if(pocetnoStanje.Count() == 0)
            {
                pocetnoStanje = _context.vrijemetransakcije.FromSqlRaw("SELECT vt.* FROM vrijemetransakcije vt WHERE vt.idCvor = " + id + " AND vt.datum = (SELECT MIN(vt2.datum) FROM vrijemetransakcije vt2 WHERE vt2.idCvor = " + id + " AND vt2.datum " + ">" + ' ' + '\'' + pocetakDana + '\'' + " AND vt2.datum < " + '\'' + krajDana + '\'' + ")").ToList();


            }

  
            var rez = pocetnoStanje.Concat(krajnjeStanje).ToList();
            rez.ForEach(e => Debug.WriteLine(e));

            return rez;
        }

        [HttpGet("getTransakcijeByDay/{id}/{noviDatum}/{izabraniDatum}")]
        public List<VrijemeTransakcije> getTransakcijeByDay(int id, string noviDatum, string izabraniDatum)
        {
            var rez = _context.vrijemetransakcije.FromSqlRaw("SELECT vt.* FROM vrijemetransakcije vt WHERE vt.idCvor = " + id + " AND vt.datum < " + '\'' + izabraniDatum + '\'' + " AND vt.datum > " + '\'' + noviDatum + '\'').ToList();
            return rez;
        }

        [HttpGet("cvor/{id}")]
        public Cvornovi? getCvorById(int id)
        {
            var rez = _context.cvornovi.Where(c => c.id == id).ToArray();
            if(rez.Length == 0)
            {
                return null;
            }
            else
            {
                return rez[0];
            }
        }

        // 
        // NE TESTIRATI/POZIVATI OVU RUTU
        //
        /* [HttpPost("postdata")]
        public async Task<IActionResult> Temproute(PromjenaKase promjena)
        {
            var cvorovi = GetNovi();
            var kasa = cvorovi.Find(x => x.id == promjena.Id);

            var vrijednosti = GetVrijednosti();
            var vrijemeTrans = new VrijemeTransakcije();
            var transakcije = new List<VrijemeTransakcije>();
            DateTime datum = Convert.ToDateTime(promjena.datum);
            var temp = (int)promjena.Stanje / 2;
            promjena.Stanje -= temp;

            datum = datum.AddSeconds(10);
            StabloUtilities.podigniKarticeSaKase(kasa, promjena, vrijednosti);
            vrijemeTrans = StabloUtilities.postaviVrijemeTransakcije(kasa, datum.ToString("yyyy-MM-ddTHH:mm:ss"), promjena.Stanje, promjena.vrijednost, promjena.valuta, vrijednosti, "podizanje");
            transakcije.Add(vrijemeTrans);

            promjena.Stanje = temp;
            datum = datum.AddSeconds(10);
            StabloUtilities.podigniKarticeSaKase(kasa, promjena, vrijednosti);
            vrijemeTrans = StabloUtilities.postaviVrijemeTransakcije(kasa, datum.ToString("yyyy-MM-ddTHH:mm:ss"), promjena.Stanje, promjena.vrijednost, promjena.valuta, vrijednosti, "podizanje");
            transakcije.Add(vrijemeTrans);

            _context.vrijemetransakcije.AddRange(transakcije);
            _context.SaveChanges();
            return Ok("ok");
        }*/

        // 
        // NE TESTIRATI/POZIVATI OVU RUTU
        //
        [HttpGet("praznici")]
        public List<praznik> getPraznici()
        {
            return _context.praznici.ToList();
        }
        [HttpGet("getNarudzbeById/{id}")]
        public List<Narudzba> getNarudzbeById(int id)
        {
            var rez = _context.narudzba.FromSqlRaw("SELECT * FROM narudzba WHERE pocetniId = " + id + "|| krajnjiId = " + id).ToList();
            return rez;
        }

        [HttpDelete("deleteNarudzba/{id}")]
        public void deleteNarudzba(int id)
        {
            var x = _context.narudzba.Where(n => n.id == id).ToArray();
            if(x.Length != 0)
            {
                _context.narudzba.Remove(x[0]);
                _context.SaveChanges();
            }
        }

        [HttpPost("updateNarudzba")]
        public void updateNarudzba(Narudzba narudzba)
        {
            var na = _context.narudzba.Where(n => n.id == narudzba.id).FirstOrDefault();
            if(na == null)
            {
                return;
            }
            else
            {
                na.naziv = narudzba.naziv;
                na.brojKartica = narudzba.brojKartica;
                na.valuta = narudzba.valuta;
                na.vrijednost = narudzba.vrijednost;
                _context.SaveChanges();
            }
        }

        [HttpPost("postdatabulk")]
        public async Task<IActionResult> PostPromjeneBulk(PromjenaKaseBulk promjena)
        {
            var cvorovi = GetNovi();
            var kasa = cvorovi.Find(x => x.id == promjena.Id);
            var vr = GetVrijednosti();

            int[] stanja = promjena.Stanje.Split(",").ToList().Select(v => Int32.Parse(v)).ToArray();
            string[] valute = promjena.valuta.Split(",");
            int[] vrijednosti = promjena.vrijednost.Split(",").ToList().Select(v => Int32.Parse(v)).ToArray();
            string[] datumi = promjena.datum.Split(",");
            string[] vrste = promjena.vrsta.Split(",");

            var transakcije = new List<VrijemeTransakcije>();
            for(int i = 0; i < stanja.Length; i++)
            {
                var pr = new PromjenaKase();
                pr.Stanje = stanja[i];
                pr.valuta = valute[i];
                pr.vrijednost = vrijednosti[i];
                pr.datum = datumi[i];
                var temp = new VrijemeTransakcije();
                if (vrste[i] == "vracanje")
                {
                    StabloUtilities.vratiKarticeUKasu(kasa, pr, vr);
                }
                else if (vrste[i] == "podizanje")
                {
                    StabloUtilities.podigniKarticeSaKase(kasa, pr, vr);
                }
                temp = StabloUtilities.postaviVrijemeTransakcije(kasa, datumi[i], stanja[i], vrijednosti[i], valute[i], vr, vrste[i]);
                transakcije.Add(temp);
            }

            _context.vrijemetransakcije.AddRange(transakcije);
            _context.SaveChanges();

            return Ok("Podaci dodani");
        }

        [HttpDelete("transakcije/{id}")]
        public async Task<IActionResult> ObrisiHistorijuZaCvor(int id)
        {
            _context.Database.ExecuteSqlRaw("DELETE FROM vrijemetransakcije WHERE idcvor = " + id);
            _context.SaveChanges();
            return Ok("Obrisano");
        }

        [HttpPost("model")]
        public async Task<IActionResult> SpasiRegresioniModel(RegresioniModel model)
        {
            if (model == null)
            {
                return BadRequest("no");
            }

            var modelZaCvorLista = _context.regresionimodel.Where(e => e.idCvor == model.idCvor).ToArray();
            if(modelZaCvorLista.Length != 0)
            {
                _context.regresionimodel.Remove(modelZaCvorLista[0]);
            }
            _context.regresionimodel.Add(model);
            _context.SaveChanges();

            return Ok("Model spasen");
        }

        [HttpGet("model/{idCvor}")]
        public RegresioniModel? getModelByIdCvor(int idCvor)
        {
            var x = _context.regresionimodel.Where(r => r.idCvor == idCvor).ToArray();
            if (x.Length == 0)
            {
                return null;
            }
            else
            {
                return x[0];
            }
        }

        [HttpPost("predikcija")]
        public async Task<IActionResult> postPredikcija(Predikcija predikcija)
        {
            var p = _context.predikcija.Where(r => r.idCvor == predikcija.idCvor).ToArray();
            if(p.Length != 0)
            {
                _context.predikcija.Remove(p[0]);
            }
            _context.predikcija.Add(predikcija);
            _context.SaveChanges();
            return Ok("Predikcija spasena");
        }

        [HttpGet("predikcija/{idCvor}")]
        public Predikcija? GetPredikcijaByIdCvor(int idCvor)
        {
            var x = _context.predikcija.Where(p => p.idCvor == idCvor).ToArray();
            if(x.Length == 0)
            {
                return null;
            }
            else
            {
                return x[0];
            }
        }

        [HttpPost("narudzbe/predikcije")]
        public async Task<IActionResult> narudzbePoPredikcijama()
        {
            var sveNarudzbe = GetNarudzbe();
            var maxId = 0;
            sveNarudzbe.ForEach(x =>
            {
                if (x.id > maxId)
                {
                    maxId = x.id + 1;
                }
            });
            var nizNaruzbi = new List<Narudzba>();
            var nizCvorova = GetNovi();
            for (var i = 0; i < nizCvorova.Count; i++)
            {
                if (nizCvorova[i].type == "Kasa")
                {


                    var predikcije = GetPredikcijaByIdCvor(nizCvorova[i].id);
                    if(predikcije != null)
                    {
                        var nizPredikcijaPoVrijednostiBam = predikcije.predikcijebam.Split(";");
                        var nizPredikcijaPoVrijednostiEur = predikcije.predikcijeeur.Split(";");
                        var nizPredikcijaPoVrijednostiUsd = predikcije.predikcijeusd.Split(";");
                        var nizPredikcijaPoVrijednostiHrk = predikcije.predikcijehrk.Split(";");
                        var nizPredikcijaPoVrijednostiGbp = predikcije.predikcijegbp.Split(";");

                        
                        //dodavanje narudzbi za BAM
                        var nizVrijednostiBam = GetVrijednosti().bamvrijednosti.Split(",");
                        for (var j = 0; j < nizPredikcijaPoVrijednostiBam.Length; j++)
                        {
                            var nizDana = nizPredikcijaPoVrijednostiBam[j].Split(",");
                            var predikcijaSutradan = Int32.Parse(nizDana[0]);

                            if (predikcijaSutradan != 0)
                            {
                                var narudzba = new Narudzba();
                                narudzba.id = maxId + 1;
                                maxId++;
                                narudzba.naziv = "automatska - " + DateTime.Today.AddDays(1).ToString("dd/MM/yyyy");
                                narudzba.valuta = "BAM";
                                narudzba.vrijednost = nizVrijednostiBam[j];
                                narudzba.tip = "automatska";
                                if (predikcijaSutradan < 0)
                                {
                                    //ako je negativna predikcija
                                    narudzba.pocetniId = (int)nizCvorova[i].parentId;
                                    narudzba.krajnjiId = nizCvorova[i].id;
                                    narudzba.brojKartica = predikcijaSutradan * (-1);

                                    nizNaruzbi.Add(narudzba);
                                }
                                else if (predikcijaSutradan > 0)
                                {
                                    //ako je pozitivna predikcija
                                    narudzba.krajnjiId = (int)nizCvorova[i].parentId;
                                    narudzba.pocetniId = nizCvorova[i].id;
                                    narudzba.brojKartica = predikcijaSutradan;

                                    nizNaruzbi.Add(narudzba);
                                }
                            }
                        }//kraj narudzbe BAM

                        

                        //dodavanje narudzbi za EUR
                        var nizVrijednostiEur = GetVrijednosti().eurvrijednosti.Split(",");
                        for (var j = 0; j < nizPredikcijaPoVrijednostiEur.Length; j++)
                        {
                            var nizDana = nizPredikcijaPoVrijednostiEur[j].Split(",");
                            var predikcijaSutradan = Int32.Parse(nizDana[0]);

                            if (predikcijaSutradan != 0)
                            {
                                var narudzba = new Narudzba();
                                narudzba.id = maxId + 1;
                                maxId++;
                                narudzba.naziv = "automatska - " + DateTime.Today.AddDays(1).ToString("dd/MM/yyyy");
                                narudzba.valuta = "EUR";
                                narudzba.vrijednost = nizVrijednostiEur[j];
                                narudzba.tip = "automatska";
                                if (predikcijaSutradan < 0)
                                {
                                    //ako je negativna predikcija
                                    narudzba.pocetniId = (int)nizCvorova[i].parentId;
                                    narudzba.krajnjiId = nizCvorova[i].id;
                                    narudzba.brojKartica = predikcijaSutradan * (-1);

                                    nizNaruzbi.Add(narudzba);
                                }
                                else if (predikcijaSutradan > 0)
                                {
                                    //ako je pozitivna predikcija
                                    narudzba.krajnjiId = (int)nizCvorova[i].parentId;
                                    narudzba.pocetniId = nizCvorova[i].id;
                                    narudzba.brojKartica = predikcijaSutradan;

                                    nizNaruzbi.Add(narudzba);
                                }
                            }
                        }//kraj narudzbe EUR



                        //dodavanje narudzbi za USD
                        var nizVrijednostiUsd = GetVrijednosti().usdvrijednosti.Split(",");
                        for (var j = 0; j < nizPredikcijaPoVrijednostiUsd.Length; j++)
                        {
                            var nizDana = nizPredikcijaPoVrijednostiUsd[j].Split(",");
                            var predikcijaSutradan = Int32.Parse(nizDana[0]);

                            if (predikcijaSutradan != 0)
                            {
                                var narudzba = new Narudzba();
                                narudzba.id = maxId + 1;
                                maxId++;
                                narudzba.naziv = "automatska - " + DateTime.Today.AddDays(1).ToString("dd/MM/yyyy");
                                narudzba.valuta = "USD";
                                narudzba.vrijednost = nizVrijednostiUsd[j];
                                narudzba.tip = "automatska";
                                if (predikcijaSutradan < 0)
                                {
                                    //ako je negativna predikcija
                                    narudzba.pocetniId = (int)nizCvorova[i].parentId;
                                    narudzba.krajnjiId = nizCvorova[i].id;
                                    narudzba.brojKartica = predikcijaSutradan * (-1);

                                    nizNaruzbi.Add(narudzba);
                                }
                                else if (predikcijaSutradan > 0)
                                {
                                    //ako je pozitivna predikcija
                                    narudzba.krajnjiId = (int)nizCvorova[i].parentId;
                                    narudzba.pocetniId = nizCvorova[i].id;
                                    narudzba.brojKartica = predikcijaSutradan;

                                    nizNaruzbi.Add(narudzba);
                                }
                            }
                        }//kraj narudzbe USD
                        
                        var nizVrijednostiHrk = GetVrijednosti().hrkvrijednosti.Split(",");
                        for (var j = 0; j < nizPredikcijaPoVrijednostiHrk.Length; j++)
                        {
                            var nizDana = nizPredikcijaPoVrijednostiHrk[j].Split(",");
                            var predikcijaSutradan = Int32.Parse(nizDana[0]);

                            if (predikcijaSutradan != 0)
                            {
                                var narudzba = new Narudzba();
                                narudzba.id = maxId + 1;
                                maxId++;
                                narudzba.naziv = "automatska - " + DateTime.Today.AddDays(1).ToString("dd/MM/yyyy");
                                narudzba.valuta = "HRK";
                                narudzba.vrijednost = nizVrijednostiHrk[j];
                                narudzba.tip = "automatska";
                                if (predikcijaSutradan < 0)
                                {
                                    //ako je negativna predikcija
                                    narudzba.pocetniId = (int)nizCvorova[i].parentId;
                                    narudzba.krajnjiId = nizCvorova[i].id;
                                    narudzba.brojKartica = predikcijaSutradan * (-1);

                                    nizNaruzbi.Add(narudzba);
                                }
                                else if (predikcijaSutradan > 0)
                                {
                                    //ako je pozitivna predikcija
                                    narudzba.krajnjiId = (int)nizCvorova[i].parentId;
                                    narudzba.pocetniId = nizCvorova[i].id;
                                    narudzba.brojKartica = predikcijaSutradan;

                                    nizNaruzbi.Add(narudzba);
                                }
                            }
                        }
                        
                        var nizVrijednostiGbp = GetVrijednosti().gbpvrijednosti.Split(",");
                        for (var j = 0; j < nizPredikcijaPoVrijednostiGbp.Length; j++)
                        {
                            var nizDana = nizPredikcijaPoVrijednostiGbp[j].Split(",");
                            var predikcijaSutradan = Int32.Parse(nizDana[0]);

                            if (predikcijaSutradan != 0)
                            {
                                var narudzba = new Narudzba();
                                narudzba.id = maxId + 1;
                                maxId++;
                                narudzba.naziv = "automatska - " + DateTime.Today.AddDays(1).ToString("dd/MM/yyyy");
                                narudzba.valuta = "GBP";
                                narudzba.vrijednost = nizVrijednostiGbp[j];
                                narudzba.tip = "automatska";
                                if (predikcijaSutradan < 0)
                                {
                                    //ako je negativna predikcija
                                    narudzba.pocetniId = (int)nizCvorova[i].parentId;
                                    narudzba.krajnjiId = nizCvorova[i].id;
                                    narudzba.brojKartica = predikcijaSutradan * (-1);

                                    nizNaruzbi.Add(narudzba);
                                }
                                else if (predikcijaSutradan > 0)
                                {
                                    //ako je pozitivna predikcija
                                    narudzba.krajnjiId = (int)nizCvorova[i].parentId;
                                    narudzba.pocetniId = nizCvorova[i].id;
                                    narudzba.brojKartica = predikcijaSutradan;

                                    nizNaruzbi.Add(narudzba);
                                }
                            }
                        }
                        
                        
                    } //kraj predikcija != null

                }
            }

            postNarudzbe(nizNaruzbi);

            return Ok("Postavljene narudzbe po predikcijama");
        }

        [HttpGet("cvoratributi")]
        public List<Cvoratributi> GetCvorAtributi()
        {
            return _context.cvoratributi.ToList();
        }

        [HttpPost("updatecvoratributi")]
        public void updateCvorAtributi(Cvoratributi cvoratributi)
        {
            var na = _context.cvoratributi.Where(n => n.cvorid == cvoratributi.cvorid).FirstOrDefault();
            if (na == null)
            {
                return;
            }
            else
            {
                na.grad = cvoratributi.grad;
                na.adresa = cvoratributi.adresa;
                na.geolokacija = cvoratributi.geolokacija;
                na.radnidani = cvoratributi.radnidani;
                na.radnovrijeme = cvoratributi.radnovrijeme;
                na.osoba = cvoratributi.osoba;
                na.telefonosobe = cvoratributi.telefonosobe;
                na.emailosobe = cvoratributi.emailosobe;

                _context.SaveChanges();
            }
        }
            
        [HttpGet("cvoratributi/{id}")]
        public Cvoratributi? GetCvoratributWithCvorid(int id)
        {
            var cvor = _context.cvoratributi.Where(c => c.cvorid == id).ToArray();
            if (cvor.Length == 0) return null;
            return cvor[0];
        }

        [HttpPost("cvoratributi")]
        public async Task<IActionResult> PostCvoratribut(Cvoratributi cvor) {
            if(cvor == null) return BadRequest("Nije dodano u bazu");
            var result = _context.cvoratributi.FirstOrDefault(c => c.cvorid == cvor.cvorid);

            if (result != null)
            {
                result.cvorid = cvor.cvorid;
                result.radnidani = cvor.radnidani;
                result.radnovrijeme = cvor.radnovrijeme;
                result.osoba = cvor.osoba;
                result.telefonosobe = cvor.telefonosobe;
                result.emailosobe = cvor.emailosobe;
                result.grad = cvor.grad;
                result.adresa = cvor.adresa;
                result.geolokacija = cvor.geolokacija;
                result.minbam = cvor.minbam;
                result.mineur = cvor.mineur;
                result.minusd = cvor.minusd;
                result.minhrk = cvor.minhrk;
                result.mingbp = cvor.mingbp;
                result.maxbam = cvor.maxbam;
                result.maxeur = cvor.maxeur;
                result.maxusd = cvor.maxusd;
                result.maxhrk = cvor.maxhrk;
                result.maxgbp = cvor.maxgbp;
                result.minvrijednost = cvor.minvrijednost;
                result.mintransfer = cvor.mintransfer;
            }
            else
            {
                 _context.cvoratributi.Add(cvor);
            }
            _context.SaveChanges();
            return Ok("Dodani atributi u bazu");
        }
    }
}
