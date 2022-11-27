import numpy as np
import requests as req

model = []
r = req.get("https://www.topupcards.somee.com/api/stablo/vrijednosti")
valutaVrijednosti = r.json()

lenbam = len(valutaVrijednosti["bamvrijednosti"].split(","))
leneur = len(valutaVrijednosti["eurvrijednosti"].split(","))
lenusd = len(valutaVrijednosti["usdvrijednosti"].split(","))
lenhrk = len(valutaVrijednosti["hrkvrijednosti"].split(","))
lengbp = len(valutaVrijednosti["gbpvrijednosti"].split(","))

for i in range(0, 4):
    model.append([0] * 6)

for i in range(4, 9):
    model.append([0] * 6)

for i in range(8, 12):
    model.append([0] * 6)

for i in range(12, 16):
    model.append([0] * 6)

for i in range(16, 20):
    model.append([0] * 6)


for i in [3, 4, 5]:
    r = req.get("https://www.topupcards.somee.com/api/stablo/model/" + str(i))
    data = r.json()

    model[0] += np.array(data["bamA"].split(",")).astype(np.float64)
    model[1] += np.array(data["bamB"].split(",")).astype(np.float64)
    model[2] += np.array(data["bamC"].split(",")).astype(np.float64)
    model[3] += np.array(data["bamD"].split(",")).astype(np.float64)

    model[4] += np.array(data["eurA"].split(",")).astype(np.float64)
    model[5] += np.array(data["eurB"].split(",")).astype(np.float64)
    model[6] += np.array(data["eurC"].split(",")).astype(np.float64)
    model[7] += np.array(data["eurD"].split(",")).astype(np.float64)

    model[8] += np.array(data["usdA"].split(",")).astype(np.float64)
    model[9] += np.array(data["usdB"].split(",")).astype(np.float64)

    model[10] += np.array(data["usdC"].split(",")).astype(np.float64)
    model[11] += np.array(data["usdD"].split(",")).astype(np.float64)

    model[12] += np.array(data["hrkA"].split(",")).astype(np.float64)
    model[13] += np.array(data["hrkB"].split(",")).astype(np.float64)
    model[14] += np.array(data["hrkC"].split(",")).astype(np.float64)
    model[15] += np.array(data["hrkD"].split(",")).astype(np.float64)

    model[16] += np.array(data["gbpA"].split(",")).astype(np.float64)
    model[17] += np.array(data["gbpB"].split(",")).astype(np.float64)
    model[18] += np.array(data["gbpC"].split(",")).astype(np.float64)
    model[19] += np.array(data["gbpD"].split(",")).astype(np.float64)

print(",".join(np.array(model[0]).astype(str)))

r = req.post('https://localhost:3000/api/stablo/model',
              json={
                  "idCvor": 2,
                  "bamA": ",".join(np.array(model[0]).astype(str)),
                  "bamB": ",".join(np.array(model[1]).astype(str)),
                  "bamC": ",".join(np.array(model[2]).astype(str)),
                  "bamD": ",".join(np.array(model[3]).astype(str)),
                  "eurA": ",".join(np.array(model[4]).astype(str)),
                  "eurB": ",".join(np.array(model[5]).astype(str)),
                  "eurC": ",".join(np.array(model[6]).astype(str)),
                  "eurD": ",".join(np.array(model[7]).astype(str)),
                  "usdA": ",".join(np.array(model[8]).astype(str)),
                  "usdB": ",".join(np.array(model[9]).astype(str)),
                  "usdC": ",".join(np.array(model[10]).astype(str)),
                  "usdD": ",".join(np.array(model[11]).astype(str)),
                  "hrkA": ",".join(np.array(model[12]).astype(str)),
                  "hrkB": ",".join(np.array(model[13]).astype(str)),
                  "hrkC": ",".join(np.array(model[14]).astype(str)),
                  "hrkD": ",".join(np.array(model[15]).astype(str)),
                  "gbpA": ",".join(np.array(model[16]).astype(str)),
                  "gbpB": ",".join(np.array(model[17]).astype(str)),
                  "gbpC": ",".join(np.array(model[18]).astype(str)),
                  "gbpD": ",".join(np.array(model[19]).astype(str))
              }, verify=False)

print("Status za upisivanje: " + str(r.status_code))
