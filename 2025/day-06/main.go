package main

import (
	_ "embed"
	"fmt"
	"regexp"
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
	lines := strings.Split(strings.TrimSpace(input), "\n")
	equations := rotate(lines)

	total := 0
	for _, eq := range equations {
		op := eq[len(eq)-1]

		var sol int
		if op == "*" {
			total += product(eq[:len(eq)-1])
		} else {
			total += sum(eq[:len(eq)-1])
		}

		total += sol
	}

	fmt.Printf("Part 1: %v\n", total)
}

func part2() {
	lines := strings.Split(input, "\n")

	total := 0
	var sol int
	var op string

	// loop over columns first, then rows
	for i := range len(lines[0]) {
		buffer := ""

		// for each column, loop over the rows
		// and build the current number in a buffer
		for _, line := range lines {
			switch char := string(line[i]); char {
			case "*":
				op = "*"
				sol = 1
			case "+":
				op = "+"
				sol = 0
			case " ":
				// noop
			default:
				buffer += char
			}
		}

		// if the buffer is empty, we're moving on
		// to the next equation, so append the current
		// equation's solution to the total and reset
		if len(buffer) == 0 {
			total += sol
			sol = 1
			continue
		}

		num, err := strconv.Atoi(buffer)
		if err != nil {
			panic(err)
		}

		// otherwise we will either add or
		// multiply the current number to the existing
		// subtotal based on the operator
		if op == "*" {
			sol *= num
		} else if op == "+" {
			sol += num
		}
	}

	total += sol
	fmt.Printf("Part 2: %v\n", total)
}

func rotate(lines []string) [][]string {
	re := regexp.MustCompile(" +")
	lineSplit := re.Split(strings.TrimSpace(lines[0]), -1)
	equations := make([][]string, len(lineSplit))
	for _, line := range lines {
		if len(line) == 0 {
			continue
		}

		lineSplit := re.Split(strings.TrimSpace(line), -1)

		for j, c := range lineSplit {
			equations[j] = append(equations[j], c)
		}
	}

	return equations
}

func sum(arr []string) int {
	sum := 0
	for _, numStr := range arr {
		num, err := strconv.Atoi(numStr)
		if err != nil {
			panic(err)
		}

		sum += num
	}

	return sum
}

func product(arr []string) int {
	product := 1
	for _, numStr := range arr {
		num, err := strconv.Atoi(numStr)
		if err != nil {
			panic(err)
		}

		product *= num
	}

	return product
}
