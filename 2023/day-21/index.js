const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'test.txt'), 'utf8');
const inputRows = input.trim().split('\n');
const rowLength = inputRows[0].length;
const gardenMap = inputRows.join('').split('');
const NUM_STEPS = 26_501_365;

let currPos = new Set();
currPos.add(gardenMap.indexOf('S'));

for (let i = 0; i < NUM_STEPS; i++) {
    newPos = [];
    for (let pos of currPos) {
        let neighbors = [];

        // north
        let northIndex = pos - rowLength;
        if (
            (northIndex >= 0 && gardenMap[northIndex] !== '#') ||
            (northIndex < 0 && gardenMap[gardenMap.length + northIndex] !== '#')
        ) {
            neighbors.push(northIndex);
        }

        // south
        let southIndex = pos + rowLength;
        if (
            (southIndex < gardenMap.length && gardenMap[southIndex] !== '#') ||
            (southIndex >= gardenMap.length && gardenMap[southIndex % gardenMap.length] !== '#')
        ) {
            neighbors.push(southIndex);
        }

        // east
        let eastIndex = pos + 1;
        if (
            (eastIndex % rowLength > 0 && gardenMap[eastIndex] !== '#') ||
            (eastIndex % rowLength === 0 && gardenMap[eastIndex - rowLength + 1] !== '#')
        ) {
            neighbors.push(eastIndex);
        }

        // west
        let westIndex = pos - 1;
        if (
            (westIndex % rowLength < rowLength - 1 && gardenMap[westIndex] !== '#') ||
            (westIndex % rowLength === rowLength - 1 && gardenMap[westIndex + rowLength] !== '#')
        ) {
            neighbors.push(westIndex);
        }

        newPos.push(...neighbors);
    }

    currPos = new Set(newPos);
}

console.log(new Set(currPos).size);
