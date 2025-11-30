const fs = require('fs');
const path = require('path');

const alpha = 'abcdefghijklmnopqrstuvwxyz';

function parse(filename) {
    try {
        const data = fs.readFileSync(path.join(__dirname, filename), 'utf8');
        const hill = [];
        for (let line of data.split(/\n/).filter((line) => !!line)) {
            hill.push(Array.from(line));
        }

        return hill;
    } catch (err) {
        throw new Error(err);
    }
}

class Graph {
    _nodes;

    constructor(nodes) {
        this.nodes = nodes || [];
    }

    addNode(node) {
        this.nodes.push(node);
    }

    get nodes() {
        return this._nodes;
    }

    set nodes(nodes) {
        this._nodes = nodes;
    }

    getNode(id) {
        return this.nodes.find((node) => node.id === id);
    }

    getStartNode() {
        return this.nodes.find((node) => node.letter === 'S');
    }

    getEndNode() {
        return this.nodes.find((node) => node.letter === 'E');
    }

    toString() {
        let str = '';
        for (let node of this.nodes) {
            str += node.toString();
            str += '\n\n';
        }

        return str;
    }
}

class GraphNode {
    _id;
    _adjacencyList;
    _distanceFromStart;
    _visited;

    constructor(id, adjacencyList) {
        this.id = id;
        this.adjacencyList = adjacencyList;
        this.distanceFromStart = Infinity;
        this.visited = false;
    }

    get adjacencyList() {
        return this._adjacencyList;
    }

    set adjacencyList(adjacencyList) {
        this._adjacencyList = adjacencyList;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    get letter() {
        return this.id.split(',')[0];
    }

    get coords() {
        return this.id.split(',').slice(1);
    }

    get distanceFromStart() {
        return this._distanceFromStart;
    }

    set distanceFromStart(distance) {
        this._distanceFromStart = distance;
    }

    get visited() {
        return this._visited;
    }

    set visited(visited) {
        this._visited = visited;
    }

    toString() {
        return `${this.letter}: ${this.coords}\n  ${this.adjacencyList.join(
            '; '
        )}`;
    }
}

function getValue(char) {
    if (char === 'S') {
        return 0;
    }

    if (char === 'E') {
        return 25;
    }

    return alpha.indexOf(char);
}

function initGraph(hill, reverse) {
    const hillGraph = new Graph();
    for (let [i, row] of hill.entries()) {
        for (let [j, char] of row.entries()) {
            const adjacencyList = [];
            const neighborCoords = [
                [i - 1, j],
                [i + 1, j],
                [i, j - 1],
                [i, j + 1],
            ].filter(
                ([ni, nj]) =>
                    hill[ni] !== undefined && hill[ni][nj] !== undefined
            );
            for (let [ni, nj] of neighborCoords) {
                let neighbor = hill[ni][nj];
                if (
                    (!reverse && getValue(neighbor) - getValue(char) <= 1) ||
                    (reverse && getValue(neighbor) - getValue(char) >= -1)
                ) {
                    adjacencyList.push([neighbor, ni, nj].join());
                }
            }

            hillGraph.addNode(
                new GraphNode([char, i, j].join(), adjacencyList)
            );
        }
    }

    return hillGraph;
}

function dijkstra(hillGraph, source) {
    hillGraph.nodes.forEach((node) => {
        node.distanceFromStart = Infinity;
    });
    source.distanceFromStart = 0;
    const priorityQueue = new Set(hillGraph.nodes.map((node) => node.id));

    while (priorityQueue.size > 0) {
        const currentNodeId = Array.from(priorityQueue).reduce((a, b) =>
            hillGraph.getNode(a).distanceFromStart <
            hillGraph.getNode(b).distanceFromStart
                ? a
                : b
        );

        const currentNode = hillGraph.getNode(currentNodeId);
        priorityQueue.delete(currentNodeId);
        for (let neighborNodeId of currentNode.adjacencyList) {
            const alt = currentNode.distanceFromStart + 1;
            const neighborNode = hillGraph.getNode(neighborNodeId);
            if (alt < neighborNode.distanceFromStart) {
                neighborNode.distanceFromStart = alt;
            }
        }
    }
}

function part1(filename) {
    const hillGraph = initGraph(parse(filename), false);
    dijkstra(hillGraph, hillGraph.getStartNode());
    console.log(hillGraph.getEndNode().distanceFromStart);
}

function part2(filename) {
    const hillGraph = initGraph(parse(filename), true);
    dijkstra(hillGraph, hillGraph.getEndNode());
    const aNodes = hillGraph.nodes.filter((node) => node.letter === 'a');
    aNodes.unshift(hillGraph.getStartNode);
    const allDistances = aNodes.map((node) => node.distanceFromStart);
    // const allDistances = [];
    // for (let sourceNode of aNodes) {
    //     dijkstra(hillGraph, sourceNode);
    //     allDistances.push(hillGraph.getEndNode().distanceFromStart);
    // }
    allDistances.sort((a, b) => a - b, 0);
    console.log(allDistances[0]);
}

// part1('test.txt');
part2('input.txt');
