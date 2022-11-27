import datetime


def getNizFromValuta(valuta, nizovi):
    if valuta == "BAM":
        return nizovi[0]
    elif valuta == "EUR":
        return nizovi[1]
    elif valuta == "USD":
        return nizovi[2]
    elif valuta == "HRK":
        return nizovi[3]
    elif valuta == "GBP":
        return nizovi[4]


def getIndexFromVrijednost(vrijednost, nizVrijednosti):
    for i in range(0, len(nizVrijednosti)):
        if nizVrijednosti[i] == str(vrijednost):
            return i


def getIndexFromValuta(valuta):
    if valuta == "BAM":
        return 0
    elif valuta == "EUR":
        return 1
    elif valuta == "USD":
        return 2
    elif valuta == "HRK":
        return 3
    elif valuta == "GBP":
        return 4


def getValutaFromIndex(index):
    if index == 0:
        return "BAM"
    elif index == 1:
        return "EUR"
    elif index == 2:
        return "USD"
    elif index == 3:
        return "HRK"
    elif index == 4:
        return "GBP"


def getDanCiklusaFromDatum(datum: datetime.datetime):
    temp = datetime.datetime(datum.year, datum.month, 7)
    prviPonedeljak = temp + datetime.timedelta(-temp.weekday())
    brojDanaOdPrvogPonedeljka = datum.day - prviPonedeljak.day
    if brojDanaOdPrvogPonedeljka < 0:
        if datum.month == 1:
            temp = datetime.datetime(datum.year - 1, 12, 7)
        else:
            temp = datetime.datetime(datum.year, datum.month - 1, 7)
        prviPonedeljak = temp + datetime.timedelta(-temp.weekday())
        brojDanaOdPrvogPonedeljka = (datum - prviPonedeljak).days

    return brojDanaOdPrvogPonedeljka
