const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

const EXPANSION_FACTOR = 1000000;

let lines = input.trim().split('\n');
let expandingRows = [];
for (let i = 0; i < lines.length; i++) {
    if (lines[i].split('').every((c) => c === '.')) {
        expandingRows.push(lines.length - i);
    }
}

expandingRows.reverse();

let expandingColumns = [];
for (let j = 0; j < lines[0].length; j++) {
    if (lines.map((l) => l[j]).every((c) => c === '.')) {
        expandingColumns.push(j);
    }
}

const expandedUniverse = lines.reverse().join('');

const re = /#/g;
const galaxies = [];
while ((match = re.exec(expandedUniverse)) !== null) {
    let rows = 0;
    let columns = 0;
    let x = match.index % lines[0].length;
    let y = Math.floor(match.index / lines[0].length);

    for (let row of expandingRows) {
        if (y < row) {
            break;
        }
        rows++;
    }

    for (let column of expandingColumns) {
        if (x < column) {
            break;
        }
        columns++;
    }

    galaxies.push([
        x + (EXPANSION_FACTOR - 1) * columns,
        y + (EXPANSION_FACTOR - 1) * rows,
    ]);
}

const galaxyPairs = [];
for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
        galaxyPairs.push([galaxies[i], galaxies[j]]);
    }
}

let sum = 0;
for (let [a, b] of galaxyPairs) {
    sum += Math.abs(a[1] - b[1]) + Math.abs(a[0] - b[0]);
}

console.log(
    galaxyPairs.reduce(
        (sum, [a, b]) => sum + Math.abs(a[1] - b[1]) + Math.abs(a[0] - b[0]),
        0
    )
);
