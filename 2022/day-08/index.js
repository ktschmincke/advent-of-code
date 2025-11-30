const path = require('path');
const fs = require('fs');

function readFile(filename) {
    try {
        return fs.readFileSync(path.join(__dirname, filename), 'utf8');
    } catch (err) {
        throw new Error(err);
    }
}

function getNumVisibleTrees(treeGrid) {
    let visibleTrees = 0;
    for (let i = 0; i < treeGrid.length; i++) {
        for (let j = 0; j < treeGrid[i].length; j++) {
            if (
                // check if tree is visible from any side
                isVisibleFromTop(treeGrid, i, j) ||
                isVisibleFromRight(treeGrid, i, j) ||
                isVisibleFromBottom(treeGrid, i, j) ||
                isVisibleFromLeft(treeGrid, i, j)
            ) {
                visibleTrees += 1;
            }
        }
    }

    return visibleTrees;
}

function isVisible(treeValue, trees) {
    return treeValue > Math.max(...trees);
}

function isVisibleFromLeft(treeGrid, i, j) {
    return isVisible(treeGrid[i][j], getLeftTrees(treeGrid, i, j));
}

function getLeftTrees(treeGrid, i, j) {
    return treeGrid[i].slice(0, j);
}

function isVisibleFromTop(treeGrid, i, j) {
    return isVisible(treeGrid[i][j], getTopTrees(treeGrid, i, j));
}

function getTopTrees(treeGrid, i, j) {
    const topTrees = [];
    for (let row of treeGrid.slice(0, i)) {
        topTrees.push(row[j]);
    }

    return topTrees;
}

function isVisibleFromRight(treeGrid, i, j) {
    return isVisible(treeGrid[i][j], getRightTrees(treeGrid, i, j));
}

function getRightTrees(treeGrid, i, j) {
    return treeGrid[i].slice(j + 1);
}

function isVisibleFromBottom(treeGrid, i, j) {
    return isVisible(treeGrid[i][j], getBottomTrees(treeGrid, i, j));
}

function getBottomTrees(treeGrid, i, j) {
    const bottomTrees = [];
    for (let row of treeGrid.slice(i + 1)) {
        bottomTrees.push(row[j]);
    }

    return bottomTrees;
}

function getScenicScoreInOneDirection(currentTree, trees) {
    let visibleTreesCount = 0;

    let i;
    for (i = 0; i < trees.length; i++) {
        if (trees[i] < currentTree) {
            visibleTreesCount++;
        } else {
            break;
        }
    }

    return i === trees.length ? i : i + 1;
}

function getTopScenicScore(treeGrid, i, j) {
    // reverse the order of top trees to get the order looking away from the current tree
    return getScenicScoreInOneDirection(treeGrid[i][j], getTopTrees(treeGrid, i, j).reverse())
}

function getBottomScenicScore(treeGrid, i, j) {
    return getScenicScoreInOneDirection(treeGrid[i][j], getBottomTrees(treeGrid, i, j));
}

function getLeftScenicScore(treeGrid, i, j) {
    // reverse the order of left trees to get the order looking away from the current tree
    return getScenicScoreInOneDirection(treeGrid[i][j], getLeftTrees(treeGrid, i, j).reverse())
}

function getRightScenicScore(treeGrid, i, j) {
    return getScenicScoreInOneDirection(treeGrid[i][j], getRightTrees(treeGrid, i, j));
}

function getTotalScenicScore(treeGrid, i, j) {
    return (
        getTopScenicScore(treeGrid, i, j) *
        getBottomScenicScore(treeGrid, i, j) *
        getLeftScenicScore(treeGrid, i, j) *
        getRightScenicScore(treeGrid, i, j)
    );
}

function getOptimalScenicScore(treeGrid) {
    let max = 0;
    for (let i = 0; i < treeGrid.length; i++) {
        for (let j = 0; j < treeGrid[i].length; j++) {
            const scenicScore = getTotalScenicScore(treeGrid, i, j);
            if (scenicScore > max) {
                max = scenicScore;
            }
        }
    }

    return max;
}

function main(filename) {
    const treeGridRaw = readFile(filename);
    const treeGrid = [];
    for (let line of treeGridRaw.split(/\n/).filter((line) => !!line)) {
        treeGrid.push(line.split(''));
    }

    console.log(getOptimalScenicScore(treeGrid));
}

main('input.txt');
