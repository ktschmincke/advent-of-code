const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'test.txt'), 'utf8');
const seedsRe = /seeds: ((?:\d+\s?)+)/;
const seeds = seedsRe
    .exec(input)[1]
    .trim()
    .split(' ')
    .map((num) => +num);

const maps = input
    .trim()
    .split('\n\n')
    .slice(1)
    .map((m) =>
        m
            .split('\n')
            .slice(1)
            .map((line) => line.split(' ').map((n) => +n))
            .map(([destStart, srcStart, rangeLength]) => ({
                sourceRange: [srcStart, srcStart + rangeLength],
                destRange: [destStart, destStart + rangeLength],
            }))
    );

function findLocationFromSeed(seed) {
    let currVal = seed;
    for (let map of maps) {
        let newVal = currVal;

        for (let { sourceRange, destRange } of map) {
            // check if val exists in this range
            if (currVal >= sourceRange[0] && currVal < sourceRange[1]) {
                let idx = currVal - sourceRange[0];
                newVal = destRange[0] + idx;
            }
        }

        currVal = newVal;
    }

    return currVal;
}

function computeRangesFromSeeds(seedRanges) {
    let currRanges = seedRanges;
    for (let map of maps) {
        let newRanges = [];

        for (let range of currRanges) {
            for (let { sourceRange, destRange } of map) {
                if (range[0] >= sourceRange[0] && range[1] < sourceRange[1]) {
                    const startIdx = range[0] - sourceRange[0];
                    const endIdx = range[1] - sourceRange[0]
                    newRanges.push([destRange[0] + startIdx, destRange[0] + endIdx]);
                } else if (range[0] < sourceRange[0] && range[1] >= sourceRange[1]) {
                    newRanges.push([destRange[0], destRange[1]]);
                } else if (
                    range[0] >= sourceRange[0] &&
                    range[0] < sourceRange[1]
                ) {
                    const idx = range[0] - sourceRange[0];
                    newRanges.push([destRange[0] + idx, destRange[1]]);
                } else if (
                    range[1] < sourceRange[1] &&
                    range[1] >= sourceRange[0]
                ) {
                    const idx = range[1] - sourceRange[0];
                    newRanges.push([destRange[0], destRange[0] + idx]);
                }
            }

            // check if new ranges covers the full input range
            if (newRanges.reduce((sum, r) => sum + r[1] - r[0], 0) !== range[1] - range[0]) {
                newRanges.push(range);
            }
        }

        if (newRanges.length > 0) currRanges = newRanges;
    }

    return currRanges;
}

function part1() {
    const minLoc = seeds.reduce((min, seed) => {
        const loc = findLocationFromSeed(seed);
        return loc < min ? loc : min;
    }, Infinity);
    console.log(minLoc);
}

function part2() {
    const ranges = [];
    for (let i = 0; i < seeds.length; i += 2) {
        const [seedStart, rangeLength] = seeds.slice(i, i + 2);
        const seedRange = [seedStart, seedStart + rangeLength];
        ranges.push(computeRangesFromSeeds([seedRange]));
    }

    let min = ranges.flat(2).reduce((min, n) => n < min ? n : min, Number.MAX_SAFE_INTEGER);
    console.log(min);
}

// part1();
part2();
