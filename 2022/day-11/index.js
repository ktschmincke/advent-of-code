const path = require('path');
const fs = require('fs');

function readFile(filename) {
    try {
        return fs.readFileSync(path.join(__dirname, filename), 'utf8');
    } catch (err) {
        throw new Error(err);
    }
}

let monkeys;
let monkeyInspections;

function initMonkeys(monkeyNoteArray) {
    for (let [i, monkeyNote] of monkeyNoteArray.entries()) {
        const startingItems = /Starting items: ([\d ,]+)\n/
            .exec(monkeyNote)[1]
            .split(/,\s?/)
            .map((item) => +item);
        monkeys[i] = monkeys[i].concat(startingItems);
    }
}

function executeRound(monkeyNoteArray, lcm) {
    for (let monkeyNote of monkeyNoteArray) {
        const monkeyIdx = /Monkey (\d+):/.exec(monkeyNote)[1];
        const inspectOp = /Operation: new = (.*)\n/.exec(monkeyNote)[1];
        const testDivisor = /Test: divisible by (\d+)/.exec(monkeyNote)[1];
        const trueOp = /If true: throw to monkey (\d)/.exec(monkeyNote)[1];
        const falseOp = /If false: throw to monkey (\d)/.exec(monkeyNote)[1];
        const items = JSON.parse(JSON.stringify(monkeys[monkeyIdx]));
        for (let oldWorryLevel of items) {
            // increment the number of inspections this monkey has made
            monkeyInspections[+monkeyIdx]++;

            // remove this item from the current monkey
            monkeys[monkeyIdx].splice(
                monkeys[monkeyIdx].indexOf(oldWorryLevel),
                1
            );

            // perform the inspection operation
            let newWorryLevel = eval(
                inspectOp.replaceAll('old', oldWorryLevel)
            );

            // reduce
            newWorryLevel = newWorryLevel % lcm;

            // test
            if (newWorryLevel % testDivisor === 0) {
                monkeys[trueOp].push(newWorryLevel);
            } else {
                monkeys[falseOp].push(newWorryLevel);
            }
        }
    }
}

function main(filename) {
    const data = readFile(filename);
    const monkeyNoteArray = data.split(/\n\n/);
    monkeys = new Array(monkeyNoteArray.length).fill(new Array());
    monkeyInspections = new Array(monkeys.length).fill(0);
    const lcm = monkeyNoteArray
        .map((monkeyNote) => /Test: divisible by (\d+)/.exec(monkeyNote)[1])
        .reduce((a, b) => a * b, 1);
    initMonkeys(monkeyNoteArray);
    for (let i = 0; i < 10000; i++) {
        executeRound(monkeyNoteArray, lcm);
    }
    monkeyInspections.sort((a, b) => b - a);
    console.log(monkeyInspections[0] * monkeyInspections[1]);
}

main('input.txt');
