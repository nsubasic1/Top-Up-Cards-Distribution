import requests
import copy
import numpy as np
import Utils
import datetime

valute = ["BAM", "EUR", "USD", "HRK", "GBP"]
idCvora = 1

r = requests.get(
    'https://www.topupcards.somee.com/api/stablo/cvor/' + str(idCvora), verify=False
)

print("Status za cvor: ", r.status_code)
cvor = r.json()

r = requests.get(
    'https://www.topupcards.somee.com/api/stablo/vrijednosti'
)

print("Status za vrijednosti: ", r.status_code)


valutaVrijednosti = r.json()

bamniz = valutaVrijednosti["bamvrijednosti"].split(',')
eurniz = valutaVrijednosti["eurvrijednosti"].split(',')
usdniz = valutaVrijednosti["usdvrijednosti"].split(',')
hrkniz = valutaVrijednosti["hrkvrijednosti"].split(',')
gbpniz = valutaVrijednosti["gbpvrijednosti"].split(',')

praznici = []
if cvor["type"] != "Prodajno mjesto":
    r = requests.get(
        'https://www.topupcards.somee.com/api/stablo/praznici', verify=False
    )

    print("Status za praznike: ", r.status_code)
    praznici = r.json()

r = requests.get(
    'https://www.topupcards.somee.com/api/stablo/model/' + str(idCvora), verify=False
)

print("Status za model: ", r.status_code)
data = r.json()

bamRegKoef = [data["bamA"].split(","), data["bamB"].split(","), data["bamC"].split(","), data["bamD"].split(",")]
eurRegKoef = [data["eurA"].split(","), data["eurB"].split(","), data["eurC"].split(","), data["eurD"].split(",")]
usdRegKoef = [data["usdA"].split(","), data["usdB"].split(","), data["usdC"].split(","), data["usdD"].split(",")]
hrkRegKoef = [data["hrkA"].split(","), data["hrkB"].split(","), data["hrkC"].split(","), data["hrkD"].split(",")]
gbpRegKoef = [data["gbpA"].split(","), data["gbpB"].split(","), data["gbpC"].split(","), data["gbpD"].split(",")]

KoefMatrica = [bamRegKoef, eurRegKoef, usdRegKoef, hrkRegKoef, gbpRegKoef]

matricaPredikcija = []
matricaKumulacioneSume = []
for i in range(0, len(valute)):
    valuta = Utils.getValutaFromIndex(i)
    niz = Utils.getNizFromValuta(valuta, [bamniz, eurniz, usdniz, hrkniz, gbpniz])
    temp1 = []
    temp2 = []
    for j in range(0, len(niz)):
        temp1.append([""])
        temp2.append([0])

    matricaPredikcija.append(copy.deepcopy(temp1))
    matricaKumulacioneSume.append(copy.deepcopy(temp2))

if r.status_code == 200:
    datum = datetime.datetime.now()
    for i in range(0, 30):
        datum = datum + datetime.timedelta(days=1)
        ciklus = Utils.getDanCiklusaFromDatum(datum)
        for j in range(0, len(valute)):
            valuta = Utils.getValutaFromIndex(j)
            niz = Utils.getNizFromValuta(valuta, [bamniz, eurniz, usdniz, hrkniz, gbpniz])
            for k in range(0, len(niz)):
                predikcijaFloat = 0
                predikcijaFloat += float(KoefMatrica[j][0][k]) * ciklus
                predikcijaFloat += float(KoefMatrica[j][1][k]) * datum.month
                predikcijaFloat += float(KoefMatrica[j][2][k]) * (datum.year - 2010)
                predikcijaFloat += float(KoefMatrica[j][3][k])
                if cvor["type"] != "Prodajno mjesto":
                    for praznik in praznici:
                        tempdatum = datetime.datetime.strptime(praznik["datumpocetni"].split('.')[0], "%Y-%m-%dT%H:%M:%S")
                        if datum.day == tempdatum.day and datum.month == tempdatum.month and datum.year == tempdatum.year:
                            predikcijaFloat *= float(praznik["pojacanje"])

                predikcija = int(predikcijaFloat)
                matricaKumulacioneSume[j][k][0] += predikcijaFloat - predikcija
                if matricaKumulacioneSume[j][k][0] > 1:
                    predikcija += 1
                    matricaKumulacioneSume[j][k][0] -= 1
                elif matricaKumulacioneSume[j][k][0] < -1:
                    predikcija -= 1
                    matricaKumulacioneSume[j][k][0] += 1

                if (cvor["kasatype"] == "Primajuća kasa" or cvor["kasatype"] == "Kasa za oštećene kartice") and predikcija < 0:
                    predikcija = 0
                elif cvor["kasatype"] == "Prodajna kasa" and predikcija > 0:
                    predikcija = 0

                matricaPredikcija[j][k][0] += str(predikcija)
                if i != 29:
                    matricaPredikcija[j][k][0] += ","

print(matricaPredikcija)
predikcijeZaRutu = [""] * 5


for i in range(0, len(valute)):
    niz = [bamniz, eurniz, usdniz, hrkniz, gbpniz][i]
    for j in range(0, len(niz)):
        predikcijeZaRutu[i] += matricaPredikcija[i][j][0]
        if j != len(niz) - 1:
            predikcijeZaRutu[i] += ";"

r = requests.post("https://www.topupcards.somee.com/api/stablo/predikcija",
              json={
                  "idCvor": idCvora,
                  "predikcijebam": predikcijeZaRutu[0],
                  "predikcijeeur": predikcijeZaRutu[1],
                  "predikcijeusd": predikcijeZaRutu[2],
                  "predikcijehrk": predikcijeZaRutu[3],
                  "predikcijegbp": predikcijeZaRutu[4],
                  "kreirananarudzba": False
              }, verify=False)

print("Status za post predikcija: ", r.status_code)

