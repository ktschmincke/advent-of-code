const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'test.txt'), 'utf8');

const re = /([UDLR]) (\d+) \((#[0-9a-f]{6})\)/g;

class LagoonTile {
    coords;
    color;

    constructor(coords, color) {
        this.coords = coords;
        this.color = color;
    }

    toString() {
        return `(${this.coords[0]}, ${this.coords[1]}) ${this.color}`
    }
}

let lagoon = [];
let currPos = [1000, 1000];
while ((match = re.exec(input)) !== null) {
    const [_, dir, length, hex] = match;

    for (let i = 0; i < +length; i++) {
        lagoon.push(new LagoonTile([...currPos], hex));

        if (dir === 'R') {
            currPos[1]++;
        } else if (dir === 'L') {
            currPos[1]--;
        } else if (dir === 'D') {
            currPos[0]++;
        } else if (dir === 'U') {
            currPos[0]--;
        } else {
            throw new Error('whoops');
        }

    }
}

// console.log(lagoon.join('\n'));

lagoon = Object.groupBy(lagoon, (l => l.coords[0]))

// let digMap = new Array(9).fill(new Array(6).fill('.'));

let sum = 0;
for (let [i, rowTiles] of Object.entries(lagoon)) {
    // for (let [j, tile] of rowTiles.entries()) {
    //     digMap[+i][j] = '#';
    // }

    let tilePos = rowTiles.map(t => t.coords[1]);
    let rowSum = Math.max(...tilePos) - Math.min(...tilePos) + 1;
    // console.log(rowSum);
    sum += rowSum;
}

// console.log(digMap.join('\n'));
console.log(sum);
