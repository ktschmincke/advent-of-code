const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

let [instructions, map] = input.split('\n\n');
instructions = instructions.split('');

function countSteps(startNode, endCond) {
    let i = 0;
    let currNode = startNode;
    while (!endCond(currNode)) {
        let currInstr = instructions[i % instructions.length];
        let [leftNode, rightNode] = new RegExp(currNode + ' = \\(([\\w0-9]{3}), ([\\w0-9]{3})\\)').exec(map).slice(1, 3);
        currNode = currInstr === 'L' ? leftNode : rightNode;
        i++;
    }
    return i;
}

function part1() {
    console.log(countSteps('AAA', (n) => n === 'ZZZ'));
}

function part2() {
    let i = 0;
    let startNodes = map.match(/([0-9\w]{2}A) = /g).map(m => m.split(' ')[0]);
    const allCounts = [];
    for (let n of startNodes) {
        allCounts.push(countSteps(n, (n) => n[2] === 'Z'));
    }

    const gcd = (a, b) => a ? gcd(b % a, a) : b;
    const lcm = (a, b) => a * b / gcd(a,b);
    console.log(allCounts.reduce(lcm));
}

part1();
part2();
