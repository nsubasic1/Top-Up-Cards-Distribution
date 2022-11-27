const { expect, request } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')
const prompt = require('prompt-sync')();
/* potrebno izmijeniti token prije pokretanja testova */
/* DOBRO OBRATITI PAZNJU NA PODATKE U BAZI PRIJE POKRETANJA TESTOVA */
let token = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJsb2xAbG9sIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibGFsYWxhbGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zdXJuYW1lIjoic3ZhcmNpIiwiZXhwIjoxNjQ5MzcxMzMxfQ.iZJ_Fuym6vREDQmM1BAXg1QrxlXdinRZ3-TN32B_HbrGo2yWgNnWIsESaqFDAistyfF1TPCe0wP2DCqzhMfoPA'
chai.use(chaiHttp)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var Sequelize = require('sequelize')
var sequelize = new Sequelize("db_a85412_osaric1", "a85412_osaric1", "omaromar1",{host: 'MYSQL8001.site4now.net',dialect:"mysql", port: '3306', logging: false});
var saveID = -1
 describe('KorisnikController', () => {

    it('/api/Korisnik/get', function(done){
        chai.request('https://localhost:5001')
        .get('/api/Korisnik/get')
        .set({ "Authorization": `Bearer ${token}` })
        .end((err,res) => {
            expect(res.status).to.equal(200)
            expect(res.body.length).to.not.equal(0)
            done();
        })
    })

    it('/api/Korisnik/edit/{id} GET', function(done){
        chai.request('https://localhost:5001')
        .get('/api/Korisnik/edit/1')
        .set({ "Authorization": `Bearer ${token}` })
        .end((err,res) => {
            expect(res.status).to.equal(200)
            expect(res.body.email).to.equal("lol@lol")
            done();
        })
    })
    
    it('/api/Korisnik/edit/{id} POST', function(done){
        chai.request('https://localhost:5001')
        .post('/api/Korisnik/edit/1')
        .send({
            "id": 1,
            "ime": "lalalala",
            "prezime": "svarci",
            "email": "lol@lol",
            "password": "123",
            "uloga_id": 2,
            "prijavljen": 0,
            "obrisan": false,
            "resetPasswordToken": null,
            "qrcodekey": "zHlx7yMeYN9",
            "usesqrcode": false
          })
        .set({ "Authorization": `Bearer ${token}` })
        .end((err,res) => {
            expect(res.status).to.equal(200) 
            chai.request('https://localhost:5001')
            .get('/api/Korisnik/edit/1')
            .set({ "Authorization": `Bearer ${token}` })
            .end((err, res) => {
                expect(res.body.ime).to.equal('lalalala')
                expect(res.body.id).to.equal(1)
                done()
            })
        
        });
    })
    

    it('/api/Korisnik/updateRole', function(done){
        chai.request('https://localhost:5001')
        .put('/api/Korisnik/updateRole')
        .send({id: 2, uloga_id: 1})
        .set({ "Authorization": `Bearer ${token}` })
        .end((err,res) => {
            expect(res.status).to.equal(200)
            expect(res.text).to.equal("Update izvrsen!")
            chai.request('https://localhost:5001')
            .get('/api/Korisnik/edit/2')
            .set({ "Authorization": `Bearer ${token}` })
            .end((err, res) => {
                expect(res.body.uloga_id).to.equal(1)    
                done()
            })
        })
    })
})

describe("Pitanja", () => {
    it('/api/Pitanja/getAll', function(done){
        chai.request('https://localhost:5001')
        .get('/api/Pitanja/getAll')
        .set({ "Authorization": `Bearer ${token}` })
        .end((err,res) => {
            expect(res.status).to.equal(200)
            done()
        })
    })

    it('/api/Pitanja/dodajPitanje', function(done){
        chai.request('https://localhost:5001')
        .post('/api/Pitanja/dodajPitanje')
        .send({id: 1, tekst: "Da li ce se ovo pitanje unijeti u bazu"})
        .set({ "Authorization": `Bearer ${token}` })
        .end((err,res) => {
            expect(res.status).to.equal(200)
            sequelize.authenticate().then(function(errors) { 
                sequelize.query("SELECT * FROM pitanja WHERE tekst = \"Da li ce se ovo pitanje unijeti u bazu\"", {type: sequelize.QueryTypes.SELECT}).then(function(pitanje){
                    expect(pitanje[0].tekst).to.equal("Da li ce se ovo pitanje unijeti u bazu") 
                    done()
                })
            }).catch(err => console.log(err))
        })
        
    })
    
   

    it('/api/Pitanja/dodajOdgovor', function(done){
        chai.request('https://localhost:5001')
        .post('/api/Pitanja/dodajOdgovor')
        .send({id: 1, idKorisnik: 1, pitanje: "Da li ce se ovo pitanje unijeti u bazu", odgovor: "Trebalo bi"})
        .set({ "Authorization": `Bearer ${token}` })
        .end((err,res) => {
            expect(res.status).to.equal(200)
            sequelize.query("SELECT * FROM pitanjaiodgovori WHERE id = 1",{type: sequelize.QueryTypes.SELECT}).then(function(pg){
   
                expect(pg[0].pitanje).to.equal("Da li ce se ovo pitanje unijeti u bazu")
                expect(pg[0].odgovor).to.equal("Trebalo bi")
                sequelize.query("DELETE FROM pitanjaiodgovori WHERE id = 1").then(function(){
                    sequelize.query("DELETE FROM pitanja WHERE tekst = \"Da li ce se ovo pitanje unijeti u bazu\"").then( function(){
                        done()
                    }).catch(err=> console.log(err))
                    
                }).catch(err=> console.log(err))
            }).catch(err=> console.log(err))
            
        })
    })

    it('/api/Pitanja/get', function(done){
        chai.request('https://localhost:5001')
        .get('/api/Pitanja/get')
        .query({email: "lol@lol"})
        .set({ "Authorization": `Bearer ${token}` })
        .end((err,res) => {
            expect(res.status).to.equal(200)
            expect(res.body[0].idKorisnik).to.equal(1) 
            done()     
        })
    })
    
    
})


describe('Register', () => {
    it('/api/Register', function(done){
        chai.request('https://localhost:5001')
        .post('/api/Register')
        .send({ime: "test", prezime: "test", email: "test@test", password: "test", rola: 1})
        .set({ "Authorization": `Bearer ${token}` })
        .end((err,res) => {
            expect(res.status).to.equal(200)
            sequelize.query("SELECT * FROM korisnik WHERE email = \"test@test\"",{type: sequelize.QueryTypes.SELECT}).then(function(k){
                expect(k[0].ime).to.equal("test")
                expect(k[0].prezime).to.equal("test")
                expect(k[0].uloga_id).to.equal(1)
                expect(k[0].prijavljen).to.equal(0)
                saveID = k[0].id

                sequelize.query("DELETE FROM korisnik WHERE email = \"test@test\"").then(function(){
                    done()
               })
             
            }).catch(err=> console.log(err)) 
        })
    })
})



