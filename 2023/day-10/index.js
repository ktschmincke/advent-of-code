const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'test4.txt'), 'utf8');
const sketch = input.trim().split('\n').map(l => l.split(''));

class SketchNode {
    // character at node
    c;

    // coordinates of node
    coords;

    // previous node
    from;

    constructor(c, coords) {
        this.c = c;
        this.coords = coords;
    }

    isEqual(newNode) {
        if (!newNode) return false;
        return this.coords[0] === newNode.coords[0] && this.coords[1] === newNode.coords[1];
    }

    toString() {
        return `{ c: ${this.c}, coords: [${this.coords[0]}, ${this.coords[1]}]`
    }
}

function canConnect(dir, newChar) {
    if (dir === 'north' && (newChar === '7' || newChar === 'F' || newChar === '|')) return true;
    if (dir === 'east' && (newChar === 'J' || newChar === '7' || newChar === '-')) return true;
    if (dir === 'south' && (newChar === 'L' || newChar === 'J' || newChar === '|')) return true;
    if (dir === 'west' && (newChar === 'F' || newChar === 'L' || newChar === '-')) return true;

    return false;
}

let i, j;
let found = false;
for (i = 0; i < sketch.length; i++) {
    for (j = 0; j < sketch[i].length; j++) {
        if (sketch[i][j] === 'S') {
            found = true;
            break;
        }
    }
    if (found) break;
}

const findNorth = ([i, j]) => sketch[i - 1] && sketch[i - 1][j] ? new SketchNode(sketch[i - 1][j], [i - 1, j]) : null;
const findEast = ([i, j]) => sketch[i] && sketch[i][j + 1] ? new SketchNode(sketch[i][j + 1], [i, j + 1]) : null;
const findSouth = ([i, j]) => sketch[i + 1] && sketch[i + 1][j] ? new SketchNode(sketch[i + 1][j], [i + 1, j]) : null;
const findWest = ([i, j]) => sketch[i] && sketch[i][j - 1] ? new SketchNode(sketch[i][j - 1], [i, j - 1]) : null;

let currNodes = [new SketchNode('S', [i, j])];
let steps = 0;

function part1() {
    // loop until the paths meet
    while (!currNodes[0].isEqual(currNodes[1])) {
        const newNodes = [];

        for (let currNode of currNodes) {
            const {c, coords} = currNode;
            const north = findNorth(coords);
            const east = findEast(coords);
            const south = findSouth(coords);
            const west = findWest(coords);

            // if S, check all surrounding
            if (c === 'S') {
                if (north && canConnect('north', north.c)) {
                    newNodes.push(Object.assign(north, {from: currNode}));
                }
                if (west && canConnect('west', west.c)) {
                    newNodes.push(Object.assign(west, {from: currNode}));
                }
                if (south && canConnect('south', south.c)) {
                    newNodes.push(Object.assign(south, {from: currNode}));
                }
                if (east && canConnect('east', east.c)) {
                    newNodes.push(Object.assign(east, {from: currNode}));
                }
            } else if (c === '7') {
                newNodes.push(Object.assign((west && !west.isEqual(currNode.from) ? west : south), { from: currNode }));
            } else if (c === 'F') {
                newNodes.push(Object.assign((east && !east.isEqual(currNode.from) ? east : south), { from: currNode }));
            } else if (c === '|') {
                newNodes.push(Object.assign((north && !north.isEqual(currNode.from) ? north : south), { from: currNode }));
            } else if (c === 'J') {
                newNodes.push(Object.assign((west && !west.isEqual(currNode.from) ? west : north), { from: currNode }));
            } else if (c === '-') {
                newNodes.push(Object.assign((west && !west.isEqual(currNode.from) ? west : east), { from: currNode }));
            } else if (c === 'L') {
                newNodes.push(Object.assign((north && !north.isEqual(currNode.from) ? north : east), { from: currNode }));
            }

        }

        if (currNodes.length > 2) {
            throw new Error('you done fucked up a a ron');
        }
        currNodes = newNodes;
        steps++;
    }

    console.log(steps);
}

function part2() {
    currNode = new SketchNode('S', [i, j]);
    const pipeNodes = [currNode];

    do {
        const {c, coords} = currNode;
        const north = findNorth(coords);
        const east = findEast(coords);
        const south = findSouth(coords);
        const west = findWest(coords);

        // if S, check all surrounding
        if (c === 'S') {
            if (north && canConnect('north', north.c)) {
                pipeNodes.push(Object.assign(north, {from: currNode}));
            } else if (west && canConnect('west', west.c)) {
                pipeNodes.push(Object.assign(west, {from: currNode}));
            } else if (south && canConnect('south', south.c)) {
                pipeNodes.push(Object.assign(south, {from: currNode}));
            } else if (east && canConnect('east', east.c)) {
                pipeNodes.push(Object.assign(east, {from: currNode}));
            }
        } else if (c === '7') {
            pipeNodes.push(Object.assign((west && !west.isEqual(currNode.from) ? west : south), { from: currNode }));
        } else if (c === 'F') {
            pipeNodes.push(Object.assign((east && !east.isEqual(currNode.from) ? east : south), { from: currNode }));
        } else if (c === '|') {
            pipeNodes.push(Object.assign((north && !north.isEqual(currNode.from) ? north : south), { from: currNode }));
        } else if (c === 'J') {
            pipeNodes.push(Object.assign((west && !west.isEqual(currNode.from) ? west : north), { from: currNode }));
        } else if (c === '-') {
            pipeNodes.push(Object.assign((west && !west.isEqual(currNode.from) ? west : east), { from: currNode }));
        } else if (c === 'L') {
            pipeNodes.push(Object.assign((north && !north.isEqual(currNode.from) ? north : east), { from: currNode }));
        }

        currNode = pipeNodes[pipeNodes.length - 1];
    } while (currNode.c !== 'S');

    sketch[currNode.coords[0]][currNode.coords[1]] = '7';

    let sum = 0;
    for (let i = 0; i < sketch.length; i++) {
        for (let j = 0; j < sketch[i].length; j++) {
            if (pipeNodes.some(n => n.isEqual(new SketchNode(sketch[i][j], [i, j])))) {
                continue;
            }

            let intersections = 0;
            let m, n;
            for (m = i - 1, n = j - 1; m >= 0 && n >= 0; m--, n--) {
                const checkNode = new SketchNode(sketch[m][n], [m, n]);
                if (pipeNodes.some(node => node.isEqual(checkNode))) {
                    intersections++;

                    if (checkNode.c === '7' || checkNode.c === 'L') {
                        intersections++;
                    }
                }
            }

            if (intersections % 2 === 1) {
                sum++;
            }
        }
    }

    console.log(sum);
}

part1();
part2();
