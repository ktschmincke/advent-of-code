const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

// assumes a and b are equal length
function getNumDiffs(a, b) {
    let diffs = 0;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            diffs++;
        }
    }
    return diffs;
}

function findMirrorLine(pattern, differences = 0) {
    const rows = pattern.split('\n');

    // check for horizontal mirror line
    for (let i = 0; i < rows.length - 1; i++) {
        let diffs = 0;
        for (let m = i, n = i + 1; m >= 0 && n < rows.length; m--, n++) {
            diffs += getNumDiffs(rows[m], rows[n]);
        }

        if (diffs === differences) {
            return 100 * (i + 1);
        }
    }

    // check for vertical mirror line
    for (let i = 0; i < rows[0].length - 1; i++) {
        let diffs = 0;
        for (let m = i, n = i + 1; m >= 0 && n < rows[0].length; m--, n++) {
            diffs += getNumDiffs(
                rows.map((r) => r[m]),
                rows.map((r) => r[n])
            );
        }

        if (diffs === differences) {
            return i + 1;
        }
    }
}

function part1() {
    console.log(
        input
            .trim()
            .split('\n\n')
            .reduce((sum, pattern) => sum + findMirrorLine(pattern, 0), 0)
    );
}

function part2() {
    console.log(
        input
            .trim()
            .split('\n\n')
            .reduce((sum, pattern) => sum + findMirrorLine(pattern, 1), 0)
    );
}

part1();
part2();
