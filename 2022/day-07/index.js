const fs = require('fs/promises');

class TreeNode {
    constructor(name, type, size, parent, children) {
        this.name = name;
        this.type = type;
        this.size = size;
        this.parent = parent;

        if (type !== 'file' && type !== 'dir') {
            throw new Error(
                `Node type was '${type}'; must be either 'file' or 'dir'`
            );
        }

        if (type === 'dir' && children) {
            this.children = children;
        }
    }

    getNode(name) {
        if (name === '..') {
            return this.parent;
        } else {
            return this.children.find((node) => node.name === name);
        }
    }

    toString() {
        let str = '';
        if (this.type === 'file') {
            str += `- ${this.name} (file, size=${this.size})`;
        } else if (this.type === 'dir') {
            str += `- ${this.name} (dir)`;
            str += this.children.map(
                (childNode) => '\n  ' + childNode.toString()
            );
        } else {
            throw new Error(
                `Node type was '${type}'; must be either 'file' or 'dir'`
            );
        }

        return str;
    }

    getSize() {
        if (this.type === 'file') {
            return +this.size;
        } else if (this.type === 'dir') {
            let sum = 0;
            for (let node of this.children) {
                sum += node.getSize();
            }
            this.size = sum;
            return sum;
        } else {
            throw new Error(
                `Node type was '${type}'; must be either 'file' or 'dir'`
            );
        }
    }

    getSizeFiltered(maxSize) {
        this.getSize();
        const dirs = this.getDirs();
        return dirs
            .filter((node) => node.size < maxSize)
            .map((node) => node.size)
            .reduce((prev, curr) => prev + curr, 0);
    }

    getDirs() {
        const dirs = [];
        if (this.type === 'dir') {
            dirs.push(this);
            this.children.forEach((childNode) => {
                dirs.push(...childNode.getDirs());
            });
        }
        return dirs;
    }
}

let fileSystem;

async function main(filename) {
    try {
        const data = await fs.readFile(
            `/Users/kevinschmincke/dev/aoc-2022/day-07/${filename}`,
            {
                encoding: 'utf8',
            }
        );

        parseFile(data);
    } catch (err) {
        console.log(err);
    }
}

function parseFile(data) {
    let currentDir;
    for (let line of data.split(/\n/)) {
        const cdMatch = /\$ cd ([\w./]+)/.exec(line);
        const fileMatch = /(\d+) ([\w.]+)/.exec(line);
        const dirMatch = /dir ([\w.]+)/.exec(line);

        if (cdMatch !== null) {
            const dir = cdMatch[1];

            if (!currentDir) {
                fileSystem = new TreeNode(dir, 'dir', 0, null, []);
                currentDir = fileSystem;
            } else {
                currentDir = currentDir.getNode(dir);
            }
        }

        if (fileMatch !== null) {
            const [_, fileSize, fileName] = fileMatch;
            currentDir.children.push(
                new TreeNode(fileName, 'file', fileSize, currentDir)
            );
        } else if (dirMatch !== null) {
            const [_, dirName] = dirMatch;
            currentDir.children.push(
                new TreeNode(dirName, 'dir', 0, currentDir, [])
            );
        }
    }

    const fsSize = fileSystem.getSize();
    const availableSpace = 70000000 - fsSize;
    const spaceNeeded = 30000000 - availableSpace;
    const dirs = fileSystem.getDirs();
    const smallestSize = Math.min(
        ...dirs.map(({ size }) => size).filter((size) => size >= spaceNeeded)
    );
    console.log(smallestSize);
}

main('input.txt');
