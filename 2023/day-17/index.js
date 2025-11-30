const path = require('path');
const fs = require('fs');

const input = fs.readFileSync(path.join(__dirname, 'test.txt'), 'utf8');

class Graph {
    nodes = [];

    constructor(nodes) {
        this.nodes = nodes ?? [];
    }

    addNode(node) {
        this.nodes.push(node);
    }
}

class GraphNode {
    constructor(weight, neighbors) {
        this.weight = weight;
        this.neighbors = neighbors;
    }
}

function findNeighbors() {}

const cityMap = input.trim().split('\n');
const cityMapGraph = new Graph();
for (let [i, row] of cityMap.entries()) {
    for (let [j, char] of row.split('').entries()) {
        let currCoords = [i, j];
        let neighbors = [];

        // north
        neighbors.push([i - 1, j, +cityMap[i - 1][j]]);
        neighbors.push([i - 2, j, +cityMap[i - 1][j] + +cityMap[i - 2][j]]);
        neighbors.push([i - 3, j, +cityMap[i - 1][j] + +cityMap[i - 2][j] + +cityMap[i - 3][j]]);

        // east
        neighbors.push([i, j + 1]);
        neighbors.push([i, j + 2]);
        neighbors.push([i, j + 3]);

        // south
        neighbors.push([i + 1, j]);
        neighbors.push([i + 2, j]);
        neighbors.push([i + 3, j]);

        // west
        neighbors.push([i, j - 1]);
        neighbors.push([i, j - 2]);
        neighbors.push([i, j - 3]);

        neighbors = neighbors
            .filter(([ni, nj]) => !!cityMap[ni] && !!cityMap[ni][nj])
            .map(([ni, nj]) => [ni, nj, +cityMap[ni][nj]]);

        cityMapGraph.addNode(new GraphNode(char, neighbors));
    }
}

console.log(cityMapGraph);
