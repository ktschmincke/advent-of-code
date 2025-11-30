"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var parseNumbers = function (str) {
    return str
        .split(' ')
        .filter(function (x) { return x !== ''; })
        .map(function (x) { return parseInt(x); });
};
var groupNumbers = function (numbers, grouping) {
    return Array.from({ length: numbers.length / grouping }, function (_, i) {
        return numbers.slice(i * grouping, i * grouping + grouping);
    });
};
var input = fs
    .readFileSync('test.txt', { encoding: 'utf8' })
    .replaceAll(/\r\n(\d)/g, ' $1')
    .split('\r\n')
    .filter(function (x) { return x !== ''; })
    .map(function (x) { return parseNumbers(x.split(':')[1]); });
var seeds = input[0];
var almanac = input.slice(1).map(function (x) { return groupNumbers(x, 3); });
function getSeedLocation(step) {
    for (var _i = 0, almanac_1 = almanac; _i < almanac_1.length; _i++) {
        var almanacEntry = almanac_1[_i];
        for (var _a = 0, almanacEntry_1 = almanacEntry; _a < almanacEntry_1.length; _a++) {
            var _b = almanacEntry_1[_a], destination = _b[0], source = _b[1], length = _b[2];
            if (source <= step && source + length > step) {
                step = destination + step - source;
                break;
            }
        }
    }
    return step;
}
console.log('Part 1', Math.min.apply(Math, seeds.map(function (x) { return getSeedLocation(x); })));
var seedRanges = groupNumbers(seeds, 2);
var doWeHaveThatSeed = function (seed) {
    return seedRanges.some(function (_a) {
        var seedStart = _a[0], length = _a[1];
        return seedStart <= seed && seedStart + length >= seed;
    });
};
// inversion of getSeedLocation function
function getSeedGivenLocation(step) {
    for (var _i = 0, _a = almanac.slice().reverse(); _i < _a.length; _i++) {
        var almanacEntry = _a[_i];
        for (var _b = 0, almanacEntry_2 = almanacEntry; _b < almanacEntry_2.length; _b++) {
            var _c = almanacEntry_2[_b], destination = _c[0], source = _c[1], length = _c[2];
            if (destination <= step && destination + length > step) {
                step = source + step - destination;
                break;
            }
        }
    }
    return step;
}
// problem inversed, rather than enumerating on enormous amount of seeds we enumerating on
// ascending locations and checks if we have got seed for that location 🤡
// Tooks ~8 seconds to compute on my pc 🤡🤡🤡
for (var i = 0; i < 1000000000; i++) {
    var seed = getSeedGivenLocation(i);
    if (doWeHaveThatSeed(seed)) {
        console.log('Part 2', i);
        break;
    }
}
