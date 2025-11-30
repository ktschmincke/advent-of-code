const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
let [workflows, parts] = input.trim().split('\n\n');

workflows = workflows
    .split('\n')
    .map((w) => ({ name: w.split('{')[0], steps: w.match(/\{(.+)\}/)[1] }));
parts = parts.split('\n').map(p => {
    const [_, x, m, a, s] = /\{x=(\d+),m=(\d+),a=(\d+),s=(\d+)\}/.exec(p);
    return {x: +x, m: +m, a: +a, s: +s};
});

function part1() {
    const acceptedParts = [];
    for (let {x, m, a, s} of parts) {
        let currWorkflow = 'in';
        while (currWorkflow !== 'A' && currWorkflow !== 'R') {
            for (let step of workflows.find(w => w.name === currWorkflow).steps.split(',')) {
                let [_, cond, newWorkflow] = /(?:([xmas][<>]\d+):)?(\w+)/.exec(step);
                if (!cond || eval(cond)) {
                    currWorkflow = newWorkflow;
                    break;
                }
            }
        }

        if (currWorkflow === 'A') {
            acceptedParts.push({x, m, a, s});
        }
    }

    console.log(acceptedParts.reduce((sum, {x,m,a,s}) => sum + x + m + a + s, 0));
}

function part2() {
    let x = [1, 4000]
    let m = [1, 4000]
    let a = [1, 4000]
    let s = [1, 4000]


}

part1();
part2();
