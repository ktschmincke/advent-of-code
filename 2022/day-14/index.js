const fs = require('fs');
const path = require('path');

function parse(filename) {
    try {
        return fs.readFileSync(path.join(__dirname, filename), 'utf8');
    } catch (err) {
        throw new Error(err);
    }
}

function findBetweenPoints([x1, y1], [x2, y2]) {
    const betweenPoints = [];

    let start, end;
    if (x1 === x2) {
        start = y1 > y2 ? y2 : y1;
        end = y1 > y2 ? y1 : y2;
        for (let i = start; i <= end; i++) {
            betweenPoints.push([x1, i]);
        }
    } else if (y1 === y2) {
        start = x1 > x2 ? x2 : x1;
        end = x1 > x2 ? x1 : x2;
        for (let i = start; i <= end; i++) {
            betweenPoints.push([i, y1]);
        }
    } else {
        throw new Error(
            'findBetween points cannot find diagonal lines. given points were:',
            [x1, y1],
            [x2, y2]
        );
    }

    return betweenPoints;
}

function setCaveGridPoint(caveGrid, [x, y], char) {
    caveGrid = JSON.parse(JSON.stringify(caveGrid));
    caveGrid[y][x] = char;
    return caveGrid;
}

function initCave(caveDataRaw) {
    const coordsRe = /(\d+),(\d+)/g;
    const allCoords = [...caveDataRaw.matchAll(coordsRe)];
    const xCoords = allCoords.map((coord) => coord[1]);
    const yCoords = allCoords.map((coord) => coord[2]);
    const xMax = Math.max(...xCoords);
    const yMax = Math.max(...yCoords);
    const xMin = Math.min(...xCoords);
    const offset = 0;

    let caveGrid = new Array(yMax + 3).fill(new Array(xMax + 1000).fill('.'));

    for (let i = 0; i < xMax + 1000; i++) {
        caveGrid = setCaveGridPoint(caveGrid, [i, yMax + 2], '#');
    }

    const caveDataLines = caveDataRaw.split(/\n/).filter((line) => !!line);
    for (let line of caveDataLines) {
        const coords = line
            .match(/(\d+,\d+)/g)
            .map((coords) => coords.split(','))
            .map(([x, y]) => [+x - offset, +y]);

        // start array at index 1 because we're doing - 1 each time
        for (let i = 1; i < coords.length; i++) {
            const betweenPoints = findBetweenPoints(coords[i - 1], coords[i]);

            for (let [x, y] of betweenPoints) {
                caveGrid = setCaveGridPoint(caveGrid, [x, y], '#');
            }
        }
    }

    caveGrid = setCaveGridPoint(caveGrid, [500 - offset, 0], '+');

    return [caveGrid, offset];
}

function printCave(caveGrid) {
    let caveGridStr = '';
    for (let row of caveGrid) {
        caveGridStr += '\n';
        for (let char of row) {
            caveGridStr += char;
        }
    }

    fs.appendFileSync(path.join(__dirname, 'output.txt'), '\n' + caveGridStr);
}

function part1(caveGrid, offset) {
    let sandAtRestCount = 0;

    here: while (true) {
        let currentCol = 500 - offset;
        let i = 1;

        while (true) {

            while (caveGrid[i][currentCol] === '.') {
                i++;
                if (i >= caveGrid.length) {
                    break here;
                }
            }

            if (caveGrid[i][currentCol - 1] === '.') {
                currentCol -= 1;
            } else if (caveGrid[i][currentCol + 1] === '.') {
                currentCol += 1;
            } else {
                break;
            }
        }

        caveGrid = setCaveGridPoint(caveGrid, [currentCol, i - 1], 'o');
        sandAtRestCount++;
        if (caveGrid[0][500 - offset] === 'o') {
            break;
        }
    }


    printCave(caveGrid);
    console.log(sandAtRestCount);
}

function main(filename) {
    fs.writeFileSync(path.join(__dirname, 'output.txt'), '');

    const data = parse(filename);
    const [caveGrid, offset] = initCave(data);
    printCave(caveGrid);
    part1(caveGrid, offset);
}

main('input.txt');
