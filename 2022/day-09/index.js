const path = require('path');
const fs = require('fs');

let positions = new Set();

function readFile(filename) {
    try {
        return fs.readFileSync(path.join(__dirname, filename), 'utf8');
    } catch (err) {
        throw new Error(err);
    }
}

function moveKnot(headCoords, tailCoords) {
    const newCoords = [tailCoords[0], tailCoords[1]];
    const [headX, headY] = headCoords;
    const [tailX, tailY] = tailCoords;

    const areTouching = Math.abs(headX - tailX) <= 1 && Math.abs(headY - tailY) <= 1;

    if (areTouching) {
        return newCoords;
    }

    if (headX !== tailX) {
        newCoords[0] += headX > tailX ? 1 : -1;
    }

    if (headY !== tailY) {
        newCoords[1] += headY > tailY ? 1 : -1;
    }

    return newCoords;
}

function moveHeadKnot([x, y], direction) {
    switch (direction) {
        case 'R':
            x += 1;
            break;
        case 'L':
            x -= 1;
            break;
        case 'U':
            y += 1;
            break;
        case 'D':
            y -= 1;
            break;
    }

    return [x, y];
}

function main(filename) {
    const movesInput = readFile(filename);
    const moves = movesInput.split(/\n/).filter((move) => !!move);
    const knots = new Array(10).fill([0,0]);
    positions.add(knots[9].join());
    for (let move of moves) {
        const [direction, distance] = move.split(' ');
        for (let i = 0; i < distance; i++) {
            knots[0] = moveHeadKnot(knots[0], direction);

            for (let j = 0; j < knots.length - 1; j++) {
                knots[j + 1] = moveKnot(knots[j], knots[j + 1])
            }

            positions.add(knots[9].join());
        }
    }

    console.log(positions.size);
}

main('input.txt');
