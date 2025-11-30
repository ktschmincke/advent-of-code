const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
const steps = input.trim().split(',');

function hash(str) {
    return str.split('')
        .reduce((curr, char) => ((curr + char.charCodeAt(0)) * 17) % 256, 0);
}

function part1() {
    console.log(steps.reduce((sum, step) => sum + hash(step), 0));
}

function part2() {
    const boxes = new Array(256).fill([]);
    for (let step of steps) {
        const [label, focalLength] = step.split(/[=-]/);
        const boxId = hash(label);

        if (!focalLength) {
            boxes[boxId] = boxes[boxId].filter(l => !l.startsWith(label));
        } else {
            let lensIdx = boxes[boxId].findIndex(l => l.startsWith(label));
            if (lensIdx > -1) {
                boxes[boxId].splice(lensIdx, 1, label + focalLength);
            } else {
                boxes[boxId] = [...boxes[boxId], label + focalLength];
            }
        }
    }

    const focusingPower = boxes.reduce((sum, box, i) => sum + box.reduce((lensSum, lens, j) => lensSum + ((i + 1) * (j + 1) * +lens[lens.length - 1]), 0), 0)
    console.log(focusingPower);
}

part1();
part2();
