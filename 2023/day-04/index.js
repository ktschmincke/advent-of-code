const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

function parseCards() {
    return input
        .trim()
        .split(/\s*\n\s*/)
        .map((line) => {
            const re = /Card\s+(\d+):\s+((?:\d+\s+)+)\|\s+((?:\d+\s*)+)/;
            const [_, id, winning, scratched] = re.exec(line);

            const winningNumbers = winning.trim().split(/\s+/);
            const scratchedNumbers = scratched.trim().split(/\s+/);
            const matchingNumbers = scratchedNumbers.filter((i) =>
                winningNumbers.includes(i)
            );

            return {
                id: +id,
                winningNumbers,
                scratchedNumbers,
                matchingNumbers,
            };
        });
}

function part1() {
    const scratchCardData = parseCards();
    const totalScore = scratchCardData.reduce(
        (sum, card) =>
            sum + Math.floor(Math.pow(2, card.matchingNumbers.length - 1)),
        0
    );
    console.log(totalScore);
}

function part2() {
    const scratchCardData = parseCards();
    for (let card of scratchCardData) {
        for (
            let j = card.id + 1;
            j < card.id + card.matchingNumbers.length + 1;
            j++
        ) {
            scratchCardData.push(scratchCardData.find(({ id }) => id === j));
        }
    }

    console.log(scratchCardData.length);
}

part1();
part2();
