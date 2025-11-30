const path = require('path');
const fs = require('fs');

function readFile(filename) {
    try {
        return fs.readFileSync(path.join(__dirname, filename), 'utf8');
    } catch (err) {
        throw new Error(err);
    }
}

let cycles = 0;
let xReg = 1;
let crt = new Array(6).fill(new Array(40).fill('.'))

function tick() {
    const crtCopy = JSON.parse(JSON.stringify(crt));
    const row = Math.floor(cycles / 40);
    const column = cycles % 40;
    const spritePositions = [xReg - 1, xReg, xReg + 1];
    if (spritePositions.includes(column)) {
        crtCopy[row][column] = '#';
    }
    cycles += 1;
    return crtCopy;
}

function printCrt() {
    let screen = '';
    for (let row of crt) {
        screen += '\n';
        for (let pixel of row) {
            screen += pixel;
        }
    }
    return screen;
}

function main(filename) {
    const input = readFile(filename);
    const instructions = input.split(/\n/).filter((instruction) => !!instruction);
    const noopRe = /noop/;
    const addRe = /addx (-?\d+)/;
    for (let instruction of instructions) {
        let noopMatch = noopRe.exec(instruction);
        let addMatch = addRe.exec(instruction);
        if (noopMatch !== null) {
            crt = tick();
        } else if (addMatch !== null) {
            crt = tick();
            crt = tick();
            xReg += +addMatch[1];
        }
    }

    console.log(printCrt());
}

main('input.txt');
