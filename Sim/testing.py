import requests as r
import datetime
from matplotlib import pyplot as plt
import numpy as np

req = r.get("https://localhost:3000/api/stablo/getVrijemeTransakcijeByIdCvor/11", verify=False)

ukupnaStanjaPoDatumu = []

data = req.json()

for i in range(0, len(data)):
    datum1 = datetime.datetime.strptime(data[i]['datum'], "%Y-%m-%dT%H:%M:%S")
    found = False
    for j in range(0, len(ukupnaStanjaPoDatumu)):
        datum2 = datetime.datetime.strptime(ukupnaStanjaPoDatumu[j]['datum'], "%Y-%m-%dT%H:%M:%S")
        if datum1.day == datum2.day and datum1.month == datum2.month and datum1.year == datum2.year:
            ukupnaStanjaPoDatumu[j]['stanje'] += data[i]['stanje']
            found = True
            break

    if not found:
        noviDatum = {"datum": data[i]['datum'], "stanje": data[i]['stanje']}
        ukupnaStanjaPoDatumu.append(noviDatum)


x = []
y = []
datumi = []
for i in range(0, len(ukupnaStanjaPoDatumu)):
    x.append(i)
    datumi.append(ukupnaStanjaPoDatumu[i]['datum'].split("T")[0])
    y.append(ukupnaStanjaPoDatumu[i]['stanje'])


plt.plot(datumi, y)
plt.tick_params(axis='x', rotation=70)
plt.ylim(0, np.max(x) + 10)
plt.grid()
plt.show()

