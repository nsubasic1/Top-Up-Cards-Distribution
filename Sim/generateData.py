import datetime
import random
import numpy as np
import time
import requests
from generisiVrijednosti import generisiVrijednosti
from Utils import getNizFromValuta

valute = ["BAM", "EUR", "USD", "HRK", "GBP"]
idCvora = 1

r = requests.get(
    'https://www.topupcards.somee.com/api/stablo/vrijednosti'
)

valutaVrijednosti = r.json()

bamniz = valutaVrijednosti["bamvrijednosti"].split(',')
eurniz = valutaVrijednosti["eurvrijednosti"].split(',')
usdniz = valutaVrijednosti["usdvrijednosti"].split(',')
hrkniz = valutaVrijednosti["hrkvrijednosti"].split(',')
gbpniz = valutaVrijednosti["gbpvrijednosti"].split(',')

r = requests.get(
    'https://www.topupcards.somee.com/api/stablo/cvor/' + str(idCvora), verify=False
)

cvor = r.json()

# NE MIJENJAJ GODINU OVDJE
pocetni = datetime.datetime.strptime("01/01/2022", "%d/%m/%Y")
krajnji = datetime.datetime.strptime("31/12/2022", "%d/%m/%Y")
pocetnidan = pocetni.timetuple().tm_yday
krajnjidan = krajnji.timetuple().tm_yday

stanja = []
datumi = []
y = np.arange(pocetnidan, krajnjidan)

stanjaZaRutu = ""
valuteZaRutu = ""
vrijednostiZaRutu = ""
datumiZaRutu = ""
vrsteZaRutu = ""

for i in y:
    #NEGO OVDJE
    datum = datetime.datetime.strptime(str(2021) + "-" + str(i), "%Y-%j")
    stanje = generisiVrijednosti(datum, cvor["id"])

    stanjaArray = []
    el = int(stanje / 10)
    for j in range(0, 10):
        stanjaArray.append(el)

    while np.sum(stanjaArray) != stanje:
        index = random.randint(0, 9)
        stanjaArray[index] += 1

    for j in range(0, 10):
        datum += datetime.timedelta(minutes=2)
        randomValuta = valute[random.randint(0, 4)]
        nizVrijednosti = getNizFromValuta(randomValuta, [bamniz, eurniz, usdniz, hrkniz, gbpniz])
        tickets = random.randint(0, len(nizVrijednosti) * 100)
        index = 0
        if tickets < len(nizVrijednosti) * 50:
            index = 0
        elif tickets < len(nizVrijednosti) * 75:
            index = 1
        elif tickets < len(nizVrijednosti) * 87.5:
            index = 2
        elif tickets < len(nizVrijednosti) * 93.75:
            index = 3
        elif tickets < len(nizVrijednosti) * 96.875:
            index = 4
        elif tickets < len(nizVrijednosti) * 98.4375:
            index = 5

        if index > len(nizVrijednosti) - 1:
            index = len(nizVrijednosti) - 1

        randomVrijednost = nizVrijednosti[index]
        vrste = ["podizanje", "vracanje"]
        randomVrsta = vrste[0]

        if cvor["kasatype"] == "Prodajna kasa" or cvor["kasatype"] == "Prodajno-primajuća kasa":
            randomVrijednost = cvor["kasavrijednost"]
            randomValuta = cvor["kasavaluta"]

        if cvor["kasatype"] == "Primajuća kasa" or cvor["kasatype"] == "Kasa za oštećene kartice":
            randomVrsta = "vracanje"
        elif cvor["kasatype"] == "Prodajno-primajuća kasa":
            randomVrsta = vrste[random.randint(0, 1)]

        stanjaZaRutu += str(stanjaArray[j]) + ","
        valuteZaRutu += randomValuta + ","
        vrijednostiZaRutu += str(randomVrijednost) + ","
        datumiZaRutu += datum.strftime("%Y-%m-%dT%H:%M:%S") + ","
        vrsteZaRutu += randomVrsta + ","

"""a = stanjaZaRutu.split(",")
b = valuteZaRutu.split(",")
c = vrijednostiZaRutu.split(",")
d = datumiZaRutu.split(",")
e = vrsteZaRutu.split(",")
print(len(a))

for i in range(0, len(a)):
    print(a[i] + " " + b[i] + " " + c[i] + " " + d[i] + " " + e[i])"""


print("started")

r = requests.post("https://www.topupcards.somee.com/api/stablo/postdatabulk",
              json={
                  'id': idCvora,
                  'stanje': stanjaZaRutu[:-1],
                  'valuta': valuteZaRutu[:-1],
                  'vrijednost': vrijednostiZaRutu[:-1],
                  'datum': datumiZaRutu[:-1],
                  'vrsta': vrsteZaRutu[:-1]
              }, verify=False)

print(r.status_code)
print(r.text)
