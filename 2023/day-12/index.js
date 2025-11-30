const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'test.txt'), 'utf8');
const lines = input.trim().split('\n');

const factorial = (n) =>
    [...Array(n + 1).keys()].slice(1).reduce((p, x) => p * x, 1);

const permutations = (n, r) => factorial(n) / factorial(n - r);
const combinations = (n, r) => factorial(n) / (factorial(r) * factorial(n - r));

let sum = 0;
for (const line of lines) {
    let [status, groups] = line.split(' ');
    groups = groups.split(',').map(n => +n);
    status = status.split(/\.+/).filter(n => !!n);

    if (status.length === groups.length) {
        for (let i = 0; i < groups.length; i++) {
            if (status[i].split('').every((c) => c === '?')) {
                console.log(permutations(status[i].length / groups[i], groups[i]));
            }
        }
    }

    console.log(status, groups);
}
