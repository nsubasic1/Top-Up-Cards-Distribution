using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PitanjaController : Controller
    {
        private readonly DataContext _datacontext;
        private readonly IPitanjeRepository _pitanjeRepository;
        private readonly IKorisnikRepository _korisnikRepository;

        public PitanjaController(DataContext dataContext, IPitanjeRepository pitanjeRepository, IKorisnikRepository korisnikRepository)
        {
            _datacontext = dataContext;
            _pitanjeRepository = pitanjeRepository;
            _korisnikRepository = korisnikRepository;
        }

        [HttpPost("promijeniPass")]
        public async Task<IActionResult> Post(PitanjaPass pitanjaPass)
        {
            var korisnik = await _korisnikRepository.GetByEmail(pitanjaPass.email);
            if (korisnik == null)
            {
                return NotFound("Ne postoji korisnik");
            }
            korisnik.password = PasswordManager.EncodePassword(pitanjaPass.password);
            await _datacontext.SaveChangesAsync();
            return Json("ok");
        }
        
        [HttpGet("getAll")]
        public async Task<JsonResult> Get()
        {
            var pitanja = await _pitanjeRepository.GetAll();
            return Json(pitanja);
        }

        [HttpPost("dodajPitanje")]
        public async Task<IActionResult> question(Pitanje pitanje)
        {
            var pitanja = await _pitanjeRepository.GetAll();
            var pitanje1 = pitanja.First();
            foreach (var item in pitanja)
            {
                if (item.id > pitanje1.id) pitanje1 = item;
            }
            var pit = await _pitanjeRepository.GetQuestionByText(pitanje.tekst);
            if (pit == null)
            {
                pitanje.id = pitanje1.id+1;
                await _datacontext.pitanja.AddAsync(pitanje);
                await _datacontext.SaveChangesAsync();
                return Json("ok");
            }
            return NotFound("Pitanje već postoji");
        }

        [HttpPost("dodajOdgovor")]
        public async Task<IActionResult> odgovor(PitanjeIOdgovor pitanjeIOdgovor)
        {
            var pit = await _pitanjeRepository.GetResponse(pitanjeIOdgovor.pitanje, pitanjeIOdgovor.idKorisnik);
            {
                await _datacontext.pitanjaiodgovori.AddAsync(pitanjeIOdgovor);
                await _datacontext.SaveChangesAsync();
                return Json("ok");
            }
            return NotFound("Već ste odgovorili na pitanje");
        }
        [HttpGet("get")]
        public async Task<IActionResult> getPitanja(string email)
        {
            var korisnik = await _korisnikRepository.GetByEmail(email);
            if (korisnik == null) return NotFound("Ne postoji korisnik");
            var pitanje = await _pitanjeRepository.GetResponseByUserId(korisnik.id);
            if(pitanje!=null)
            return Json(pitanje);
            return NotFound("Nije odgovorio na pitanje");
        }
        
        [HttpPost("provjeriOdgovor")]
        public async Task<IActionResult> provjeriOdg(PitanjeIOdgovor pitanjeIOdg)
        {
            var pitodg = await _pitanjeRepository.GetResponse(pitanjeIOdg.pitanje, pitanjeIOdg.idKorisnik);
            if (pitodg.odgovor != pitanjeIOdg.odgovor) return Json("Netacan odgovor");
            return Json("ok");
        }

    }
}
