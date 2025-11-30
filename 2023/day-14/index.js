const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

let rows = input.trim().split('\n');

function transformRow(row, i, to) {
    let newRow = row.split('');
    newRow.splice(i, 1, to);
    return newRow.join('');
}

function tiltNorth(rows) {
    for (let [i, row] of rows.entries()) {
        for (let [j, char] of row.split('').entries()) {
            if (char === 'O') {
                for (let n = i - 1; n >= 0; n--) {
                    if (rows[n][j] === '#' || rows[n][j] === 'O') {
                        break;
                    }

                    rows[n] = transformRow(rows[n], j, 'O');
                    rows[n + 1] = transformRow(rows[n + 1], j, '.');
                }
            }
        }
    }

    return rows;
}

function tiltSouth(rows) {
    return tiltNorth(rows.reverse()).reverse();
}

function tiltRowWest(row) {
    for (let [i, char] of row.split('').entries()) {
        if (char === 'O') {
            for (let m = i - 1; m >= 0; m--) {
                if (row[m] === '#' || row[m] === 'O') {
                    break;
                }

                row = transformRow(row, m, 'O');
                row = transformRow(row, m + 1, '.');
            }
        }
    }

    return row;
}

function tiltRowEast(row) {
    return tiltRowWest(row.split('').reverse().join(''))
        .split('')
        .reverse()
        .join('');
}

function tiltWest(rows) {
    for (let [i, row] of rows.entries()) {
        rows[i] = tiltRowWest(row);
    }

    return rows;
}

function tiltEast(rows) {
    for (let [i, row] of rows.entries()) {
        rows[i] = tiltRowEast(row);
    }

    return rows;
}

function getTotalLoad(rows) {
    return rows.reduce(
        (sum, row, i) =>
            sum + (rows.length - i) * (row.match(/O/g) ?? []).length,
        0
    );
}

function part1() {
    console.log({ totalLoad: getTotalLoad(rows) });
}

function part2() {
    const NUM_CYCLES = 1000;
    for (let i = 0; i < NUM_CYCLES; i++) {
        rows = tiltNorth(rows);
        rows = tiltWest(rows);
        rows = tiltSouth(rows);
        rows = tiltEast(rows);
    }

    console.log(getTotalLoad(rows));
}

part1();
part2();
