const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'test.txt'), 'utf8');

const parsedInput = /Time:\s+((?:\d+\s*)+)\nDistance:\s+((?:\d+\s*)+)\n/
    .exec(input)
    .slice(1, 3)
    .map((line) => line.split(/\s+/).map(n => +n))

const races = [];
for (let i = 0; i < parsedInput[0].length; i++) {
    races.push({ t: parsedInput[0][i], d: parsedInput[1][i] });
}

function getNumWins(t, d) {
    let waysToWin = [];

    for (let i = 0; i <= t; i++) {
        const timeLeft = t - i;
        const distance = timeLeft * i;
        if (distance > d) {
            waysToWin.push(i);
        }
    }

    return waysToWin.length;
}

function part1() {
    let product = 1;
    for (let { t, d } of races) {
        product *= getNumWins(t, d);
    }

    console.log(product);
}

function part2() {
    let raceTime = +races.map(({ t }) => t).join('');
    let raceDistance = +races.map(({ d }) => d).join('');
    console.log(getNumWins(raceTime, raceDistance));
}

part1();
part2();
