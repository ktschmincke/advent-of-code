package main

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
)

type Graph struct {
	nodes []*GraphNode
}

type GraphNode struct {
	id    int
	edges map[int]int
}

func New() *Graph {
	return &Graph{
		nodes: []*GraphNode{},
	}
}

func (g *Graph) AddNode() (id int) {
	id = len(g.nodes)
	g.nodes = append(g.nodes, &GraphNode{
		id:    id,
		edges: make(map[int]int),
	})

	return
}

func (g *Graph) AddEdge(n1, n2 int) {
	g.nodes[n1].edges[n2] = 1
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func main() {
	_, dir, _, ok := runtime.Caller(0)
	if !ok {
		errors.New("unable to get the current dir")
	}

	data, err := os.ReadFile(filepath.Join(filepath.Dir(dir), "test.txt"))
	check(err)

	fmt.Println(string(data))

}
