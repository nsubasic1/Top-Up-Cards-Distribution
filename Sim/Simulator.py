import datetime
import sys
from generisiVrijednosti import generisiVrijednosti

sys.path.append("venv/Lib/site-packages")

import requests
import numpy as np
import random
import time

rute = np.array(
    ['https://www.topupcards.somee.com/api/stablo/podigni',
     'https://www.topupcards.somee.com/api/stablo/vrati',
     'https://www.topupcards.somee.com/api/stablo/vratiostecene'])

tok = 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJtbXVqaWMyQGV0Zi51bnNhLmJhIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTWVobWVkIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvc3VybmFtZSI6Ik11amljIiwiZXhwIjoxNjUxMDc2MzY2fQ.mXzdooIe_dEMAjSqn4f1wx3VsE8jxoyD8K3O7AgS0yv9Va2ottlzIBOaEvkaIi3P6KdAHDpsF3GOMZpVL1m1Ag'

r = requests.get(
    'http://greed2100-001-site1.itempurl.com/api/stablo/getnovi',
    headers={'Authorization': 'bearer ' + tok}
)

cvorovi = r.json()
nizKasa = []
for i in np.arange(0, len(cvorovi)):
    if cvorovi[i]["kasatype"] is not None:
        kasa = {"id": cvorovi[i]["id"], "kasatype": cvorovi[i]["kasatype"]}
        if cvorovi[i]["kasatype"] == "Prodajna kasa" or cvorovi[i]["kasatype"] == "Prodajno-primajuća kasa":
            kasa["valute"] = [cvorovi[i]["kasavaluta"]]
            kasa["vrijednosti"] = [cvorovi[i]["kasavrijednost"]]
        else:
            kasa["valute"] = ["BAM", "EUR", "USD", "HRK", "GBP"]

        nizKasa.append(kasa)

r = requests.get(
    'http://greed2100-001-site1.itempurl.com/api/stablo/vrijednosti',
    headers={'Authorization': 'bearer ' + tok}
)

valutaVrijednosti = r.json()

bamniz = valutaVrijednosti["bamvrijednosti"].split(',')
eurniz = valutaVrijednosti["eurvrijednosti"].split(',')
usdniz = valutaVrijednosti["usdvrijednosti"].split(',')
hrkniz = valutaVrijednosti["hrkvrijednosti"].split(',')
gbpniz = valutaVrijednosti["gbpvrijednosti"].split(',')

nizoviVrijednosti = [bamniz, eurniz, usdniz, hrkniz, gbpniz]

stanja = np.arange(1, 6)

while (True):
    datum = datetime.datetime.now()

    randomkasa = nizKasa[random.randint(0, len(nizKasa) - 1)]
    stanjeZaDatum = generisiVrijednosti(datum, randomkasa["id"])
    print("Ukupno kartica na ovaj datum: " + str(stanjeZaDatum))
    svaStanja = []
    for i in np.arange(0, stanjeZaDatum):
        if stanjeZaDatum <= 0:
            break

        stanje = random.randint(1, 5)
        if stanjeZaDatum <= stanje:
            svaStanja.append(stanjeZaDatum)
            stanjeZaDatum = 0
        else:
            stanjeZaDatum -= stanje
            svaStanja.append(stanje)

    for j in np.arange(0, len(svaStanja)):
        timeout = 0
        datum = datum + datetime.timedelta(seconds=10)
        randomstanje = svaStanja[j]
        randombroj = random.randint(0, 1)
        niz = []
        r = None
        if randomkasa["kasatype"] == "Prodajna kasa" or (
                randomkasa["kasatype"] == "Prodajno-primajuća kasa" and randombroj == 1):
            try:
                r = requests.post(rute[0],
                                  json={'id': int(randomkasa["id"]),
                                        'stanje': int(randomstanje),
                                        'valuta': randomkasa["valute"][0],
                                        'vrijednost': int(randomkasa["vrijednosti"][0]),
                                        'datum': datum.strftime("%Y-%m-%dT%H:%M:%S")
                                        },
                                  timeout=5)
            except requests.exceptions.Timeout:
                print("Timeout: server nije odgovorio")
                timeout = 1

            niz.append("podigni")
            niz.append(randomkasa["id"])
            niz.append(randomstanje)
            niz.append(randomkasa["valute"][0])
            niz.append(randomkasa["vrijednosti"][0])
        elif randomkasa["kasatype"] == "Prodajno-primajuća kasa" and randombroj == 0:
            try:
                r = requests.post(rute[1],
                                  json={'id': int(randomkasa["id"]),
                                        'stanje': int(randomstanje),
                                        'valuta': randomkasa["valute"][0],
                                        'vrijednost': int(randomkasa["vrijednosti"][0]),
                                        'datum': datum.strftime("%Y-%m-%dT%H:%M:%S")
                                        },
                                  timeout=5)
            except requests.exceptions.Timeout:
                print("Timeout: server nije odgovorio")
                timeout = 1

            niz.append("vrati")
            niz.append(randomkasa["id"])
            niz.append(randomstanje)
            niz.append(randomkasa["valute"][0])
            niz.append(randomkasa["vrijednosti"][0])
        else:
            randomindex = random.randint(0, len(randomkasa["valute"]) - 1)
            randomvaluta = randomkasa["valute"][randomindex]
            temp = nizoviVrijednosti[randomindex]
            randomvrijednost = temp[random.randint(0, len(temp) - 1)]
            if randomkasa["kasatype"] == "Primajuća kasa":
                try:
                    r = requests.post(rute[1],
                                      json={'id': int(randomkasa["id"]),
                                            'stanje': int(randomstanje),
                                            'valuta': randomvaluta,
                                            'vrijednost': int(randomvrijednost),
                                            'datum': datum.strftime("%Y-%m-%dT%H:%M:%S")
                                            },
                                      timeout=5)
                except requests.exceptions.Timeout:
                    print("Timeout: server nije odgovorio")
                    timeout = 1

                niz.append("vrati")
                niz.append(randomkasa["id"])
                niz.append(randomstanje)
                niz.append(randomvaluta)
                niz.append(randomvrijednost)
            else:
                try:
                    r = requests.post(rute[2],
                                      json={'id': int(randomkasa["id"]),
                                            'stanje': int(randomstanje),
                                            'valuta': randomvaluta,
                                            'vrijednost': int(randomvrijednost),
                                            'datum': datum.strftime("%Y-%m-%dT%H:%M:%S")
                                            },
                                      timeout=5)
                except requests.exceptions.Timeout:
                    print("Timeout: server nije odgovorio")
                    timeout = 1

                niz.append("vratiostecene")
                niz.append(randomkasa["id"])
                niz.append(randomstanje)
                niz.append(randomvaluta)
                niz.append(randomvrijednost)

        if timeout == 1:
            continue
        if r.status_code == 200:
            print(niz[0] +
                  ", kasa: " + str(niz[1]) +
                  ", stanje: " + str(niz[2]) +
                  ", valuta: " + str(niz[3]) +
                  ", vrijednost: " + str(niz[4]) +
                  ", datum: " + datum.strftime("%Y-%m-%dT%H:%M:%S") +
                  " --;;-- Zahtjev uspjesan, poruka servera: " + r.text)
        else:
            print(niz[0] +
                  ", kasa: " + str(niz[1]) +
                  ", stanje: " + str(niz[2]) +
                  ", valuta: " + str(niz[3]) +
                  ", vrijednost: " + str(niz[4]) +
                  ", datum: " + datum.strftime("%Y-%m-%dT%H:%M:%S") +
                  " --;;-- Zahtjev neuspjesan, poruka servera: " + r.text)
        time.sleep(7)
