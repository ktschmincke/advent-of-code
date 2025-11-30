const path = require('path');
const fs = require('fs');

const filename = 'input.txt';

function part1(input) {
    let sum = 0;
    for (let game of input.split(/\n/)) {
        if (!game) continue;

        let isPossible = true;
        const gameRe = /^Game (\d+):(.*$)/g;
        [_, gameId, gameData] = gameRe.exec(game);

        for (let set of gameData.split(';')) {
            let reds = /(\d+) red/.exec(set);
            let blues = /(\d+) blue/.exec(set);
            let greens = /(\d+) green/.exec(set);

            if (reds && reds[1] > 12) {
                isPossible = false;
                break;
            }

            if (greens && greens[1] > 13) {
                isPossible = false;
                break;
            }

            if (blues && blues[1] > 14) {
                isPossible = false;
                break;
            }
        }

        if (isPossible) {
            sum += +gameId;
        }
    }

    return sum;
}

function part2(input) {
    let powerLevelSum = 0;
    for (let game of input.split(/\n/)) {
        if (!game) continue;

        const getMax = (color) => {
            const re = new RegExp(`(\\d+) ${color}`, 'g');
            const matches = game.match(re);
            if (matches !== null) {
                return matches
                    .map((line) => line.split(/\s/)[0])
                    .reduce((max, num) => (+num > max ? +num : max), 0);
            } else {
                return 0;
            }
        };

        const redMax = getMax('red');
        const blueMax = getMax('blue');
        const greenMax = getMax('green');

        powerLevelSum += (redMax * greenMax * blueMax);
    }

    return powerLevelSum;
}

const input = fs.readFileSync(path.join(__dirname, filename), 'utf8');
console.log(part1(input));
console.log(part2(input));
