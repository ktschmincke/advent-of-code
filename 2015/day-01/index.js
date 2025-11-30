const fs = require('fs');
const path = require('path');

function readFile(filename) {
    try {
        return fs.readFileSync(path.join(__dirname, filename), 'utf8');
    } catch (err) {
        throw new Error(err);
    }
}

function main(filename) {
    const data = readFile(filename);
    let currentFloor = 0;
    let i = 0;
    for (let char of data.split('')) {
        i++;
        if (char === '(') {
            currentFloor++;
        } else if (char === ')') {
            currentFloor--;
        }

        if (currentFloor < 0) {
            break;
        }
    }

    return i;
}

console.log(main('input.txt'));
