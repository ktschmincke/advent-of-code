const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
const histories = input.trim().split(/\n/);

let sum = 0;
for (let history of histories) {
    let steps = [];
    steps.push(history.split(' ').map(n => +n));
    while (true) {
        let latestStep = steps[steps.length - 1];
        let values = [];
        for (let i = 1; i < latestStep.length; i++) {
            values.push(latestStep[i] - latestStep[i - 1]);
        }

        // put new array at beginning of steps array
        steps.push(values);

        if (values.every(n => n === 0)) {
            break;
        }
    }

    for (let i = steps.length - 1; i >=0; i--) {
        steps[i].unshift(steps[i][0] - (i + 1 >= steps.length ? 0 : steps[i + 1][0]));
    }

    sum += steps[0][0];
}

console.log(sum);
