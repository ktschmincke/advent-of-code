import std/tables
import strutils
import std/re
proc getNumbersFromString(inputString: string): seq[int] =
    var numberSeq = newSeq[int]()
    for inputPart in inputString.split(" "):
        if len(inputPart) > 0:
            let number = parseInt(inputPart)
            numberSeq.add(number)
    return numberSeq
proc getNumbersMapFromString(inputString: string): seq[seq[int]] =
    var numberMapSeq = newSeq[seq[int]]()
    let inputParts = inputString.split("\n")
    for idx, inputPart in inputParts:
        if idx == 0:
            continue #skip the label
        numberMapSeq.add(getNumbersFromString(inputPart))
    return numberMapSeq
let input = readFile("test.txt")
let inputParts = input.split("\n\n")
var seeds = getNumbersFromString(inputParts[0].split(": ")[1])
var seedsToSoil = getNumbersMapFromString(inputParts[1])
var soilToFert = getNumbersMapFromString(inputParts[2])
var fertToWater = getNumbersMapFromString(inputParts[3])
var waterToLight = getNumbersMapFromString(inputParts[4])
var lightToTemp = getNumbersMapFromString(inputParts[5])
var tempToHumidity = getNumbersMapFromString(inputParts[6])
var humidityToLocation = getNumbersMapFromString(inputParts[7])
proc convertNumbers(numbers: seq[int], mapping: seq[seq[int]]): seq[int] =
    var newNumberSeq = newSeq[int]()
    for number in numbers:
        var found = true
        for map in mapping:
            if number in map[1]..map[1]+map[2]-1:
                newNumberSeq.add(map[0]+number-map[1])
                found = true
                break
        if not found:
            newNumberSeq.add(number)
    return newNumberSeq
proc partOne(): int =
    var
        soil = convertNumbers(seeds, seedsToSoil)
        fert = convertNumbers(soil, soilToFert)
        water = convertNumbers(fert, fertToWater)
        light = convertNumbers(water, waterToLight)
        temp = convertNumbers(light, lightToTemp)
        humidity = convertNumbers(temp, tempToHumidity)
        location = convertNumbers(humidity, humidityToLocation)
    var min = location[0]
    for loc in location:
        if loc < min:
            min = loc
    return min

proc convertRange(numRange: (int, int), mapping: seq[seq[int]]): seq[(int, int)] =
    var newRanges = newSeq[(int, int)]()
    let myStart = numRange[0]
    let myEnd = numRange[0]+numRange[1]-1
    for map in mapping:
        let mapSourceStart = map[1]
        let mapSourceEnd = map[1]+map[2]-1
        if (myStart <= mapSourceEnd and myStart >= mapSourceStart) or (myEnd <= mapSourceEnd and myEnd >= mapSourceStart) or (mapSourceStart >= myStart and mapSourceEnd <= myEnd):
            if mapSourceStart >= myStart and mapSourceEnd <= myEnd:
                newRanges.add((map[0], map[2]))
            elif myStart >= mapSourceStart and myEnd <= mapSourceEnd:
                newRanges.add((map[0]+myStart-mapSourceStart, numRange[1]))
                return newRanges
            elif myStart <= mapSourceEnd and myStart >= mapSourceStart:
                newRanges.add((map[0]+myStart-mapSourceStart, mapSourceEnd-myStart+1))
            elif myEnd >= mapSourceStart and myEnd <= mapSourceEnd:
                newRanges.add((map[0], myEnd-mapSourceStart+1))


    return newRanges
proc convertRanges(numRanges: seq[(int, int)], mapping: seq[seq[int]]): seq[(int, int)] =
    echo "LEN: " & $len(numRanges)
    var newRanges = newSeq[(int, int)]()
    for numRange in numRanges:
        newRanges.add(convertRange(numRange, mapping))
    return newRanges
proc partTwo(): int =
    var seedRanges = @[
        (seeds[0], seeds[1]),
        (seeds[2], seeds[3]),
        (seeds[4], seeds[5]),
        (seeds[6], seeds[7]),
        (seeds[8], seeds[9]),
        (seeds[10], seeds[11]),
        (seeds[12], seeds[13]),
        (seeds[14], seeds[15]),
        (seeds[16], seeds[17]),
        (seeds[18], seeds[19]),
    ]
    var
        soil = convertRanges(seedRanges, seedsToSoil)
        fert = convertRanges(soil, soilToFert)
        water = convertRanges(fert, fertToWater)
        light = convertRanges(water, waterToLight)
        temp = convertRanges(light, lightToTemp)
        humidity = convertRanges(temp, tempToHumidity)
        location = convertRanges(humidity, humidityToLocation)
    echo location
    var min = location[0][0]
    for loc in location:
        if loc[0] < min:
            min = loc[0]
    return min
# echo partOne()
echo partTwo()
