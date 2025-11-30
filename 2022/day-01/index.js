const fs = require('fs');
const path = require('path');

function parse(filename) {
    try {
        return fs.readFileSync(path.join(__dirname, filename), 'utf8');
    } catch (err) {
        throw new Error(err);
    }
}

function main(filename) {
    const data = parse(filename);
    const sortedElves = data.split(/\n\n/g)
        .map((elf) =>
            elf
                .split(/\n/)
                .map((snack) => +snack)
                .reduce((prev, curr) => prev + curr, 0)
        )
        .sort((a, b) => b - a);
    console.log(sortedElves[0]);
    console.log(sortedElves[0] + sortedElves[1] + sortedElves[2])
}

main('test.txt');
main('input.txt');
