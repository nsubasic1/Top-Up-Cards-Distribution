import datetime
import calendar
import random

from matplotlib import pyplot as plt
import numpy as np


# (-0.5x + 5 * id * ((2022 + 50 * months_from_2022)/2022)) * x^(-0.2)
def generisiVrijednosti(datum: datetime.datetime, cvorId):
    datum = datum.replace(hour=0, minute=0, second=0, microsecond=0)

    # Generisi prosli ponedeljak u odnosu na trenutni datum
    prosliPondedeljak = datum + datetime.timedelta(-datum.weekday())
    brojDanaODPrvogPonedeljka = 0

    # Ako se prosli ponedeljak nalazi u prethodnom mjesecu, nastavi uzorkovanje
    if prosliPondedeljak.month != datum.month:
        # Generisi prvi ponedeljak u prethodnom mjesecu
        temp = datetime.datetime(prosliPondedeljak.year, prosliPondedeljak.month, 7)
        prviPondeljakPrethodnogMjeseca = temp + datetime.timedelta(-temp.weekday())
        # Generisi ukupan broj dana u prethodnom mjesecu
        ukupnoDanaUPrethodnomMjesecu = calendar.monthrange(prosliPondedeljak.year, prosliPondedeljak.month)
        # Ukupan broj dana od prvog ponedeljka
        brojDanaODPrvogPonedeljka = ukupnoDanaUPrethodnomMjesecu[1] - prviPondeljakPrethodnogMjeseca.day + datum.day + 1
    # Prosli ponedeljak je u istom mjesecu
    else:
        # Generisi prvi ponedeljak u datom mjesecu
        temp = datetime.datetime(datum.year, datum.month, 7)
        prviPoneddeljak = temp + datetime.timedelta(-temp.weekday())
        # Ukupan broj dana od prvog ponedeljka
        brojDanaODPrvogPonedeljka = datum.day - prviPoneddeljak.day

    x = (brojDanaODPrvogPonedeljka * 5) + 10
    months_from_2022 = (datum.year - 2022) * 12 + datum.month

    if datum.weekday() == 5:
        mul = random.randint(2, 5)
        x -= 5 * mul
    elif datum.weekday() == 6:
        mul = random.randint(1, 3)
        x -= 5 * mul

    if cvorId < 10:
        k = 100
    else:
        k = 10 * cvorId

    ukupnoKarticaZaDatum = int((-0.25 * x + k * ((2022 + 20 * months_from_2022) / 2022)) * x ** (-0.1))
    # ukupnoKarticaZaDatum = int(-(x ** 2 / 300) + 150)

    return ukupnoKarticaZaDatum


"""x = []
y = np.arange(1, 366)
for i in y:
    x.append(generisiVrijednosti(datetime.datetime.strptime(str(2022) + "-" + str(i), "%Y-%j"), 11))

plt.plot(y, x)
plt.ylim(0, np.max(x) + 10)
# plt.show()

part_x = x[0:25]
part_y = y[0:25]

split_x = []
split_y = []
first = 0
for i in range(1, len(part_x)):
    if part_x[i - 1]< part_x[i]:
        split_x.append(part_x[first:i])
        split_y.append(part_y[first:i])
        first = i

split_x.append(part_x[first:len(part_x)])
split_y.append(part_y[first:len(part_y)])

predictedX = []
predictedY = []
for i in range(0, len(split_x)):
    if i != len(split_x) - 1:
        poly = np.polyfit(split_y[i], split_x[i], 5)
        part_data = np.poly1d(poly)(split_y[i])
        print(split_y)
        predictedX = np.concatenate((predictedX, part_data.astype(int)))
        predictedY = np.concatenate((predictedY, split_y[i]))
    else:
        poly = np.polyfit(split_y[i], split_x[i], 1)
        j = len(split_y[i]) - 1
        while split_y[i][j] != 28:
            print(split_y[i])
            split_y[i] = np.concatenate((split_y[i], [(split_y[i][j] + 1)]))
            j = len(split_y[i]) - 1
        part_data = np.poly1d(poly)(split_y[i])
        predictedX = np.concatenate((predictedX, part_data.astype(int)))
        predictedY = np.concatenate((predictedY, split_y[i]))

plt.plot(predictedY, predictedX, 'g')
plt.show()

d = datetime.datetime(2022, 5, 22)
d = d.replace(minute=0, second=0, microsecond=0, hour=0)
x = datetime.datetime.now()
y = datetime.datetime.strptime("2022-182", "%Y-%j")"""

# print(calendar.monthrange(datetime.datetime.now().year, datetime.datetime.now().month - 1)[1])
# print(d + datetime.timedelta(-d.weekday()))
