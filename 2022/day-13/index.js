const fs = require('fs');
const path = require('path');

function parse(filename) {
    try {
        return fs.readFileSync(path.join(__dirname, filename), 'utf8');
    } catch (err) {
        throw new Error(err);
    }
}

function arePacketsInOrder(left, right) {
    let inOrder = null;
    while (inOrder === null && left.length > 0) {
        if (left.length === 0) {
            inOrder = true;
            continue;
        } else if (right.length === 0) {
            inOrder = false;
            continue;
        }

        let leftEl = left.shift();
        let rightEl = right.shift();

        if (Array.isArray(leftEl) && !Array.isArray(rightEl)) {
            rightEl = [rightEl];
        }

        if (!Array.isArray(leftEl) && Array.isArray(rightEl)) {
            leftEl = [leftEl];
        }

        if (
            !Array.isArray(leftEl) &&
            !Array.isArray(rightEl) &&
            leftEl !== rightEl
        ) {
            inOrder = leftEl < rightEl;
        } else {
            inOrder = arePacketsInOrder(leftEl, rightEl);
        }
    }

    if (inOrder === null && left.length === 0 && right.length > 0) {
        inOrder = true;
    }

    return inOrder;
}

function part1(filename) {
    const data = parse(filename);
    const packetPairArray = [];
    for (let pairStr of data.split(/\n\n/).filter((line) => !!line)) {
        packetPairArray.push(pairStr.split(/\n/).filter((packet) => !!packet));
    }
    const correctIndicies = [];
    for (let [i, [left, right]] of packetPairArray.entries()) {
        if (arePacketsInOrder(JSON.parse(left), JSON.parse(right))) {
            correctIndicies.push(i + 1);
        }
    }

    const sum = correctIndicies.reduce((a, b) => a + b, 0);
    console.log(sum);
}

function part2(filename) {
    const data = parse(filename);
    const packets = data.split(/\n/).filter((packet) => !!packet);

    packets.push('[[2]]', '[[6]]');
    packets.sort((left, right) =>
        arePacketsInOrder(JSON.parse(left), JSON.parse(right)) ? -1 : 1
    );

    console.log((packets.indexOf('[[2]]') + 1) * (packets.indexOf('[[6]]') + 1));
}

part1('input.txt');
part2('input.txt');
