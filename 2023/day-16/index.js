const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
const contraption = input.trim().split('\n');

const dirMap = {
    north: [-1, 0],
    east: [0, 1],
    south: [1, 0],
    west: [0, -1],
};

function lightItUp(startingPos) {
    let currPos = [startingPos];
    const energized = [];
    while (currPos.some(({ end }) => !end)) {

        for (let [i, { coords, dir, end }] of currPos.entries()) {
            if (end) continue;

            const nextCoords = [
                coords[0] + dirMap[dir][0],
                coords[1] + dirMap[dir][1],
            ];

            // if you run into the edge, this path dies
            if (nextCoords[0] >= contraption.length ||
                nextCoords[1] >= contraption[0].length ||
                nextCoords[0] < 0 ||
                nextCoords[1] < 0
            ) {
                currPos[i].end = true;
                continue;
            }

            if (energized.find((e) => e.coords.join(',') === nextCoords.join(',') && e.dir === dir && e.char === '.')) {
                currPos[i].end = true;
                continue;
            }

            const next = contraption[nextCoords[0]][nextCoords[1]];
            if (next === '.') {
                energized.push({ coords: nextCoords, dir, char: next });
            } else if (next === '/') {
                if (dir === 'east') {
                    dir = 'north';
                } else if (dir === 'north') {
                    dir = 'east';
                } else if (dir === 'south') {
                    dir = 'west';
                } else if (dir === 'west') {
                    dir = 'south';
                }
                energized.push({ coords: nextCoords, dir, char: next });
            } else if (next === '\\') {
                if (dir === 'east') {
                    dir = 'south';
                } else if (dir === 'north') {
                    dir = 'west';
                } else if (dir === 'south') {
                    dir = 'east';
                } else if (dir === 'west') {
                    dir = 'north';
                }
                energized.push({ coords: nextCoords, dir, char: next });
            } else if (next === '-') {
                if (dir === 'north' || dir === 'south') {
                    dir = 'east';
                    currPos.push({ coords: nextCoords, dir: 'west' });
                }
                energized.push({ coords: nextCoords, dir, char: next });
            } else if (next === '|') {
                if (dir === 'east' || dir === 'west') {
                    dir = 'north';
                    currPos.push({ coords: nextCoords, dir: 'south' });
                }
                energized.push({ coords: nextCoords, dir, char: next });
            }

            currPos[i] = { coords: nextCoords, dir };
        }
    }

    return new Set(energized.map(({ coords }) => coords.join(','))).size;
}

function part1() {
    console.log(lightItUp({ coords: [0, -1], dir: 'east' }));
}

function part2() {
    let total = [];
    for (let i = 0; i < contraption.length; i++) {
        total.push(lightItUp({coords: [i, -1], dir: 'east'}));
        total.push(lightItUp({coords: [i, contraption[i].length], dir: 'west'}));
    }

    for (let i = 0; i < contraption[0].length; i++) {
        total.push(lightItUp({coords: [-1, i], dir: 'south'}));
        total.push(lightItUp({coords: [contraption.length, i], dir: 'north'}));
    }

    console.log(Math.max(...total));
}

part1();
part2();
