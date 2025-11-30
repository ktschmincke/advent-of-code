const path = require('path');
const fs = require('fs');

function parseLine(line) {
    const numberMatches = line.match(/(\d)/g);

    if (numberMatches === null) {
        return 0;
    }

    const first = numberMatches[0];
    const last = numberMatches[numberMatches.length - 1];
    return +(first + last);
}

function part1(input) {
    return input.split(/\n/).reduce((sum, line) => sum + parseLine(line), 0);
}

function part2(input) {
    return input.split(/\n/).reduce((sum, line) => {
        const convertMap = {
            one: 'o1e',
            two: 't2o',
            three: 't3e',
            four: 'f4r',
            five: 'f5e',
            six: 's6x',
            seven: 's7n',
            eight: 'e8t',
            nine: 'n9e',
        };

        for (let [key, value] of Object.entries(convertMap)) {
            line = line.replaceAll(key, value);
        }

        return sum + parseLine(line);
    }, 0);
}

function main(filename) {
    const input = fs.readFileSync(path.join(__dirname, filename), 'utf8');
    console.log(part1(input));
    console.log(part2(input));
}

main('input.txt');
