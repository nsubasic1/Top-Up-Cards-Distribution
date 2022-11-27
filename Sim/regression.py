import copy
import datetime

import numpy as np
import requests
from sklearn.linear_model import LinearRegression

import Utils

valute = ["BAM", "EUR", "USD", "HRK", "GBP"]
idCvora = 1

r = requests.get(
    'https://www.topupcards.somee.com/api/stablo/vrijednosti'
)

print(r.status_code)
valutaVrijednosti = r.json()

bamniz = valutaVrijednosti["bamvrijednosti"].split(',')
eurniz = valutaVrijednosti["eurvrijednosti"].split(',')
usdniz = valutaVrijednosti["usdvrijednosti"].split(',')
hrkniz = valutaVrijednosti["hrkvrijednosti"].split(',')
gbpniz = valutaVrijednosti["gbpvrijednosti"].split(',')

r = requests.get(
    'https://www.topupcards.somee.com/api/stablo/getVrijemeTransakcijeByIdCvor/' + str(idCvora), verify=False
)

data = r.json()
print(len(data))

#for i in range(0, len(data)):
#    trenNizovi = [[0] * len(bamniz), [0] * len(eurniz), [0] * len(usdniz), [0] * len(hrkniz), [0] * len(gbpniz)]

transakcijePoDatumu = []
for i in range(0, len(data)):
    datum1 = datetime.datetime.strptime(data[i]["datum"], "%Y-%m-%dT%H:%M:%S")
    found = False
    for j in range(0, len(transakcijePoDatumu)):
        datum2 = datetime.datetime.strptime(transakcijePoDatumu[j]["datum"], "%Y-%m-%dT%H:%M:%S")
        if datum1.day == datum2.day and datum1.month == datum2.month and datum1.year == datum2.year:
            found = True
            nizVrijednosti = Utils.getNizFromValuta(data[i]["valuta"], [bamniz, eurniz, usdniz, hrkniz, gbpniz])
            index1 = Utils.getIndexFromValuta(data[i]["valuta"])
            index2 = Utils.getIndexFromVrijednost(data[i]["vrijednost"], nizVrijednosti)
            if data[i]["vrsta"] == "vracanje":
                transakcijePoDatumu[j]["tren"][index1][index2] += data[i]["stanje"]
            elif data[i]["vrsta"] == "podizanje":
                transakcijePoDatumu[j]["tren"][index1][index2] -= data[i]["stanje"]
            transakcijePoDatumu[j]["ukupno"] += data[i]["stanje"]

    if not found:
        trenNizovi = [[0] * len(bamniz), [0] * len(eurniz), [0] * len(usdniz), [0] * len(hrkniz), [0] * len(gbpniz)]
        noviObjekat = {"datum": data[i]["datum"], "tren": trenNizovi, "ukupno": 0}
        nizVrijednosti = Utils.getNizFromValuta(data[i]["valuta"], [bamniz, eurniz, usdniz, hrkniz, gbpniz])
        index1 = Utils.getIndexFromValuta(data[i]["valuta"])
        index2 = Utils.getIndexFromVrijednost(data[i]["vrijednost"], nizVrijednosti)
        if data[i]["vrsta"] == "vracanje":
            noviObjekat["tren"][index1][index2] += data[i]["stanje"]
        elif data[i]["vrsta"] == "podizanje":
            noviObjekat["tren"][index1][index2] -= data[i]["stanje"]

        noviObjekat["ukupno"] += data[i]["stanje"]
        transakcijePoDatumu.append(noviObjekat)


modeli = []
modelZaRutu = []
X = []
Y = []
# 5 valuta
for i in range(0, len(valute)):
    valuta = Utils.getValutaFromIndex(i)
    niz = Utils.getNizFromValuta(valuta, [bamniz, eurniz, usdniz, hrkniz, gbpniz])
    temp1 = []
    temp2 = []
    for j in range(0, len(niz)):
        temp1.append([])
        temp2.append(LinearRegression())
    
    X.append(copy.deepcopy(temp1))
    Y.append(copy.deepcopy(temp1))
    modeli.append(temp2)
    modelZaRutu.append(copy.deepcopy(temp1))

for i in range(0, len(transakcijePoDatumu)):
    datum = datetime.datetime.strptime(transakcijePoDatumu[i]["datum"], "%Y-%m-%dT%H:%M:%S")
    danCiklusa = Utils.getDanCiklusaFromDatum(datum)

    for j in range(0, len(transakcijePoDatumu[i]["tren"])):
        for k in range(0, len(transakcijePoDatumu[i]["tren"][j])):
            X[j][k].append([danCiklusa, datum.month, datum.year - 2010])
            Y[j][k].append(transakcijePoDatumu[i]["tren"][j][k])


for i in range(0, len(X)):
    for j in range(0, len(X[i])):
        modeli[i][j].fit(X[i][j], Y[i][j])
        modelZaRutu[i][j].append("")
        for k in modeli[i][j].coef_:
            modelZaRutu[i][j][0] += str(('{:.10f}'.format(k))) + ","
        modelZaRutu[i][j][0] += '%.10f' % modeli[i][j].intercept_


print(modeli[0][0].predict([[0, 5, 11]]))
print(modeli[0][0].predict([[0, 5, 12]]))
print(modeli[0][0].coef_)
print(modeli[0][0].intercept_)

print(modeli[0][2].predict([[0, 5, 11]]))
print(modeli[0][2].predict([[0, 5, 12]]))
print(modeli[0][2].predict([[24, 5, 12]]))
print(modeli[0][2].predict([[25, 5, 12]]))
print(modeli[0][2].predict([[26, 5, 12]]))
print(modeli[0][2].predict([[27, 5, 12]]))
print(modeli[0][2].predict([[28, 5, 12]]))
print(modeli[0][2].coef_)
print(modeli[0][2].intercept_)

bamA = ""
bamB = ""
bamC = ""
bamD = ""
for i in range(0, len(modelZaRutu[0])):
    temp = modelZaRutu[0][i][0].split(",")
    bamA += temp[0]
    bamB += temp[1]
    bamC += temp[2]
    bamD += temp[3]
    if i != len(modelZaRutu[0]) - 1:
        bamA += ","
        bamB += ","
        bamC += ","
        bamD += ","

eurA = ""
eurB = ""
eurC = ""
eurD = ""
for i in range(0, len(modelZaRutu[1])):
    temp = modelZaRutu[1][i][0].split(",")
    eurA += temp[0]
    eurB += temp[1]
    eurC += temp[2]
    eurD += temp[3]
    if i != len(modelZaRutu[1]) - 1:
        eurA += ","
        eurB += ","
        eurC += ","
        eurD += ","

usdA = ""
usdB = ""
usdC = ""
usdD = ""
for i in range(0, len(modelZaRutu[1])):
    temp = modelZaRutu[1][i][0].split(",")
    usdA += temp[0]
    usdB += temp[1]
    usdC += temp[2]
    usdD += temp[3]
    if i != len(modelZaRutu[1]) - 1:
        usdA += ","
        usdB += ","
        usdC += ","
        usdD += ","

hrkA = ""
hrkB = ""
hrkC = ""
hrkD = ""
for i in range(0, len(modelZaRutu[1])):
    temp = modelZaRutu[1][i][0].split(",")
    hrkA += temp[0]
    hrkB += temp[1]
    hrkC += temp[2]
    hrkD += temp[3]
    if i != len(modelZaRutu[1]) - 1:
        hrkA += ","
        hrkB += ","
        hrkC += ","
        hrkD += ","

gbpA = ""
gbpB = ""
gbpC = ""
gbpD = ""
for i in range(0, len(modelZaRutu[1])):
    temp = modelZaRutu[1][i][0].split(",")
    gbpA += temp[0]
    gbpB += temp[1]
    gbpC += temp[2]
    gbpD += temp[3]
    if i != len(modelZaRutu[1]) - 1:
        gbpA += ","
        gbpB += ","
        gbpC += ","
        gbpD += ","

r = requests.post('https://www.topupcards.somee.com/api/stablo/model',
              json={
                  "idCvor": idCvora,
                  "bamA": bamA,
                  "bamB": bamB,
                  "bamC": bamC,
                  "bamD": bamD,
                  "eurA": eurA,
                  "eurB": eurB,
                  "eurC": eurC,
                  "eurD": eurD,
                  "usdA": usdA,
                  "usdB": usdB,
                  "usdC": usdC,
                  "usdD": usdD,
                  "hrkA": hrkA,
                  "hrkB": hrkB,
                  "hrkC": hrkC,
                  "hrkD": hrkD,
                  "gbpA": gbpA,
                  "gbpB": gbpB,
                  "gbpC": gbpC,
                  "gbpD": gbpD
              }, verify=False)


