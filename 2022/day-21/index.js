const path = require('path');
const fs = require('fs');
const nerdamer = require('nerdamer/all.min');

function readFile(filename) {
    try {
        return fs.readFileSync(path.join(__dirname, filename), 'utf8');
    } catch (err) {
        throw new Error(err);
    }
}

function getMonkeyValue(monkeyData, monkeyName) {
    const val = monkeyData[monkeyName];

    if (!isNaN(val)) {
        return val;
    }

    const re = /(\w{4}) ([+-/*]) (\w{4})/g;
    const [_, firstMonkeyName, op, secondMonkeyName] = re.exec(val);
    return eval(
        `${getMonkeyValue(monkeyData, firstMonkeyName)} ${op} ${getMonkeyValue(
            monkeyData,
            secondMonkeyName
        )}`
    );
}

function buildEquation(monkeyData, monkeyName) {
    const val = monkeyData[monkeyName];

    if (!isNaN(val) || val === 'humn') {
        return val;
    }

    const re = /(\w{4}) ([+-/*]) (\w{4})/g;
    const [_, firstMonkeyName, op, secondMonkeyName] = re.exec(val);
    return `(${buildEquation(
        monkeyData,
        firstMonkeyName
    )} ${op} ${buildEquation(monkeyData, secondMonkeyName)})`;
}

function part1(monkeyData) {
    console.log(getMonkeyValue(monkeyData, 'root'));
}

function part2(monkeyData) {
    const [firstMonkeyName, secondMonkeyName] =
        monkeyData['root'].split(/ [+-/*] /);
    monkeyData['root'] = `${firstMonkeyName} - ${secondMonkeyName}`;
    monkeyData['humn'] = 'humn';
    const eq = buildEquation(monkeyData, 'root');
    const solution = nerdamer.solve(eq, 'humn');
    console.log(eq);
    console.log(solution.text());
}

function main(filename) {
    const data = readFile(filename);
    const monkeys = data
        .split('\n')
        .filter((line) => !!line)
        .reduce(
            (monkeyObj, line) =>
                Object.assign({}, monkeyObj, {
                    [line.split(':')[0]]: line.split(': ')[1],
                }),
            {}
        );

    // part1(monkeys);
    part2(monkeys);
}

main('test.txt');
