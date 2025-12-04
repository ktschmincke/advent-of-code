package main

import (
	_ "embed"
	"fmt"
	"strconv"
	"strings"
)

//go:embed input.txt
var input string

func main() {
	part1()
	part2()
}

func part1() {
	rollsMap := make(map[string]string)
	for i, line := range strings.Split(input, "\n") {
		for j, c := range strings.Split(line, "") {
			rollsMap[makeKey(i, j)] = c
		}
	}

	total := 0

	for k, c := range rollsMap {
		if c != "@" {
			continue
		}

		i, j := getCoords(k)

		surroundingCount := countAdjacent(i, j, rollsMap)

		if surroundingCount < 4 {
			total += 1
		}
	}

	fmt.Printf("Part 1: %v\n", total)
}

func part2() {
	kmap := make(map[string]string)
	for i, line := range strings.Split(input, "\n") {
		for j, c := range strings.Split(line, "") {
			kmap[makeKey(i, j)] = c
		}
	}

	total := 0
	ok := true

	for ok {
		var toDelete []string
		for k, c := range kmap {
			if c != "@" {
				continue
			}

			i, j := getCoords(k)

			surroundingCount := countAdjacent(i, j, kmap)

			if surroundingCount < 4 {
				toDelete = append(toDelete, k)
			}
		}

		total += len(toDelete)

		for _, k := range toDelete {
			kmap[k] = "."
		}

		if len(toDelete) == 0 {
			ok = false
		}
	}

	fmt.Printf("Part 2: %v\n", total)
}

func makeKey(i, j int) string {
	return strconv.Itoa(i) + ":" + strconv.Itoa(j)
}

func getCoords(key string) (int, int) {
	coords := strings.Split(key, ":")
	i, err := strconv.Atoi(coords[0])
	if err != nil {
		panic(err)
	}

	j, err := strconv.Atoi(coords[1])
	if err != nil {
		panic(err)
	}

	return i, j
}

func countAdjacent(i, j int, rollsMap map[string]string) int {
	surroundingCount := 0

	// top left
	if v, ok := rollsMap[makeKey(i-1, j-1)]; ok && v == "@" {
		surroundingCount += 1
	}

	// top
	if v, ok := rollsMap[makeKey(i-1, j)]; ok && v == "@" {
		surroundingCount += 1
	}

	// top right
	if v, ok := rollsMap[makeKey(i-1, j+1)]; ok && v == "@" {
		surroundingCount += 1
	}

	// left
	if v, ok := rollsMap[makeKey(i, j-1)]; ok && v == "@" {
		surroundingCount += 1
	}

	// right
	if v, ok := rollsMap[makeKey(i, j+1)]; ok && v == "@" {
		surroundingCount += 1
	}

	// bottom left
	if v, ok := rollsMap[makeKey(i+1, j-1)]; ok && v == "@" {
		surroundingCount += 1
	}

	// bottom
	if v, ok := rollsMap[makeKey(i+1, j)]; ok && v == "@" {
		surroundingCount += 1
	}

	// bottom right
	if v, ok := rollsMap[makeKey(i+1, j+1)]; ok && v == "@" {
		surroundingCount += 1
	}

	return surroundingCount
}
