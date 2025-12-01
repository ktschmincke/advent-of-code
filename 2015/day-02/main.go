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
	total := 0
	for _, present := range strings.Split(input, "\n") {
		length, width, height := getDims(present)

		side1 := length * width
		side2 := length * height
		side3 := width * height

		smallestSide := min(side1, side2, side3)
		total = total + (2 * side1) + (2 * side2) + (2 * side3) + smallestSide
	}

	fmt.Printf("part 1 answer: %v\n", total)
}

func part2() {
	total := 0
	for _, present := range strings.Split(input, "\n") {
		length, width, height := getDims(present)

		side1 := 2*length + 2*width
		side2 := 2*length + 2*height
		side3 := 2*width + 2*height

		smallestSide := min(side1, side2, side3)
		total += smallestSide + length*width*height
	}

	fmt.Printf("part 2 answer: %v\n", total)
}

func getDims(present string) (int, int, int) {
	dims := strings.Split(present, "x")

	if dims[0] == "" {
		return 0, 0, 0
	}

	length, err := strconv.Atoi(dims[0])
	if err != nil {
		panic(err)
	}

	width, err := strconv.Atoi(dims[1])
	if err != nil {
		panic(err)
	}

	height, err := strconv.Atoi(dims[2])
	if err != nil {
		panic(err)
	}

	return length, width, height
}
