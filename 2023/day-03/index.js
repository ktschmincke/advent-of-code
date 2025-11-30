const path = require('path');
const fs = require('fs');

function getSurroundingChars(match, matchIdx, lineLength) {
    const surroundingChars = [];

    // previous line
    for (
        let j = matchIdx - lineLength - 1;
        j < matchIdx - lineLength + match.length + 1;
        j++
    ) {
        surroundingChars.push(schematic[j]);
    }

    // next line
    for (
        let j = matchIdx + lineLength - 1;
        j < matchIdx + lineLength + match.length + 1;
        j++
    ) {
        surroundingChars.push(schematic[j]);
    }

    // before/after on current line
    surroundingChars.push(schematic[matchIdx - 1]);
    surroundingChars.push(schematic[matchIdx + match.length]);

    return surroundingChars;
}

function readNum(idx) {
    if (!/\d/.test(schematic[idx])) {
        return;
    }

    let currNum = '';

    // back up to beginning of number
    while (/\d/.test(schematic[idx - 1])) {
        idx--;
    }

    // read the whole number char by char
    while (/\d/.test(schematic[idx])) {
        currNum += schematic[idx];
        idx++;
    }

    return currNum;
}

function getSurroundingNumbers(match, matchIdx, lineLength) {
    const surroundingNumbers = [];

    // previous line
    for (
        let j = matchIdx - lineLength - 1;
        j < matchIdx - lineLength + match.length + 1;
        j++
    ) {
        surroundingNumbers.push(readNum(j));
    }

    // next line
    for (
        let j = matchIdx + lineLength - 1;
        j < matchIdx + lineLength + match.length + 1;
        j++
    ) {
        surroundingNumbers.push(readNum(j));
    }

    // before/after on current line
    surroundingNumbers.push(readNum(matchIdx - 1));
    surroundingNumbers.push(readNum(matchIdx + match.length));

    return [...new Set([...surroundingNumbers].filter(n => n))];
}

function part1(schematic) {
    let sum = 0;

    // +1 to account for newline char
    const lineLength = schematic.split('\n')[0].length + 1;

    const re = /(\d+)/g;
    let match = re.exec(schematic);
    while (match !== null) {
        const surroundingChars = getSurroundingChars(
            match[0],
            match.index,
            lineLength
        );

        if (
            (surroundingChars ?? [])
                .filter((char) => !!char)
                .some((char) => /[^\d.\n]/.test(char))
        ) {
            sum += +match[0];
        }

        match = re.exec(schematic);
    }

    return sum;
}

function part2(schematic) {
    let sum = 0;

    // +1 to account for newline char
    const lineLength = schematic.split('\n')[0].length + 1;

    const re = /(\*)/g;
    let gearMatch = re.exec(schematic);
    while (gearMatch !== null) {
        const surroundingNumbers = getSurroundingNumbers(gearMatch[0], gearMatch.index, lineLength);
        if (surroundingNumbers.length === 2) {
            sum += surroundingNumbers[0] * surroundingNumbers[1];
        }

        gearMatch = re.exec(schematic);
    }

    return sum;
}

const schematic = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

console.log(part1(schematic));
console.log(part2(schematic));
