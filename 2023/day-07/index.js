const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

const CARD_VALUES = [ '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A', ];
const CARD_VALUES_WITH_JOKERS = [ 'J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A', ];

const HAND_TYPES = [
    'high',
    'one-pair',
    'two-pair',
    'three-kind',
    'full-house',
    'four-kind',
    'five-kind',
];

function countHand(hand) {
    let cardCount = new Map();
    for (let card of hand.split('')) {
        if (cardCount.has(card)) {
            cardCount.set(card, cardCount.get(card) + 1);
        } else {
            cardCount.set(card, 1);
        }
    }
    return cardCount;
}

function countHandWithJokers(hand) {
    let cardCount = countHand(hand);
    let highestCard = '';
    let highestCardCount = Number.MIN_SAFE_INTEGER;
    for (const [card, count] of cardCount) {
        // find the highest card count that's not a joker
        if (card !== 'J' && count > highestCardCount) {
            highestCard = card;
            highestCardCount = count;
        }
    }

    // add the number of jokers to the card with the highest count (besides joker)
    cardCount.set(
        highestCard,
        cardCount.get(highestCard) + (hand.match(/J/g) ?? []).length
    );
    cardCount.delete('J');
    return cardCount;
}

function getHandType(hand, withJokers = false) {
    let cardCount;
    if (withJokers) {
        cardCount = countHandWithJokers(hand);
    } else {
        cardCount = countHand(hand);
    }

    const counts = [...cardCount.values()];
    const countsSize = cardCount.size;
    const has4 = counts.some((n) => n === 4);
    const has3 = counts.some((n) => n === 3);
    const has2 = counts.some((n) => n === 2);

    if (countsSize === 1) {
        return HAND_TYPES.indexOf('five-kind');
    } else if (has4) {
        return HAND_TYPES.indexOf('four-kind');
    } else if (countsSize === 2 && has3) {
        return HAND_TYPES.indexOf('full-house');
    } else if (has3) {
        return HAND_TYPES.indexOf('three-kind');
    } else if (countsSize === 3 && has2) {
        return HAND_TYPES.indexOf('two-pair');
    } else if (has2) {
        return HAND_TYPES.indexOf('one-pair');
    } else {
        return HAND_TYPES.indexOf('high');
    }
}

function getTotalWinnings(withJokers = false) {
    return input
        .trim()
        .split('\n')
        .map((line) => ({
            hand: line.split(' ')[0],
            bid: +line.split(' ')[1],
        }))
        .sort((cardA, cardB) => {
            let diff =
                getHandType(cardA.hand, withJokers) -
                getHandType(cardB.hand, withJokers);
            if (diff !== 0) {
                return diff;
            }

            for (let i = 0; i < cardA.hand.length; i++) {
                diff =
                    (withJokers ? CARD_VALUES_WITH_JOKERS : CARD_VALUES ).indexOf(cardA.hand[i]) -
                    (withJokers ? CARD_VALUES_WITH_JOKERS : CARD_VALUES ).indexOf(cardB.hand[i]);
                if (diff !== 0) {
                    break;
                }
            }

            return diff;
        })
        .reduce((sum, { hand, bid }, i) => sum + bid * (i + 1), 0);
}

function part1() {
    console.log(getTotalWinnings());
}

function part2() {
    console.log(getTotalWinnings(true));
}

part1();
part2();
