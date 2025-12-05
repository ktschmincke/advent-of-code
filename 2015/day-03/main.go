package main

import (
	_ "embed"
	"fmt"
)

//go:embed input.txt
var input string

func main() {
	part1()
	part2()
}

func part1() {
	houseMap := make(map[string]bool)
	houseMap["0,0"] = true

	x, y := 0, 0
	for _, char := range input {
		switch char {
		case '>':
			x++
		case '<':
			x--
		case '^':
			y++
		case 'v':
			y--
		}

		houseMap[fmt.Sprintf("%d,%d", x, y)] = true
	}

	fmt.Printf("Part 1: %v\n", len(houseMap))
}

func part2() {
	santaMap := make(map[string]bool)
	roboMap := make(map[string]bool)

	santaMap["0,0"] = true
	roboMap["0,0"] = true

	santaX, santaY := 0, 0
	roboX, roboY := 0, 0

	for i, char := range input {
		if i%2 == 0 {
			// Santa's turn
			switch char {
			case '>':
				santaX++
			case '<':
				santaX--
			case '^':
				santaY++
			case 'v':
				santaY--
			}

			santaMap[fmt.Sprintf("%d,%d", santaX, santaY)] = true
		} else {
			// Robo-Santa's turn
			switch char {
			case '>':
				roboX++
			case '<':
				roboX--
			case '^':
				roboY++
			case 'v':
				roboY--
			}

			roboMap[fmt.Sprintf("%d,%d", roboX, roboY)] = true
		}
	}

	combinedMap := make(map[string]bool)
	for k := range santaMap {
		combinedMap[k] = true
	}
	for k := range roboMap {
		combinedMap[k] = true
	}

	fmt.Printf("Part 2: %v\n", len(combinedMap))
}
