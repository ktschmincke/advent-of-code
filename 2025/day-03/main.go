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
	for bank := range strings.SplitSeq(input, "\n") {
		batteries := strings.Split(bank, "")
		if len(batteries) == 0 {
			continue
		}

		first, highestIndex := highest(batteries[:len(batteries)-1])
		last, _ := highest(batteries[highestIndex+1:])

		joltage, err := strconv.Atoi(first + last)
		if err != nil {
			panic(err)
		}

		total += joltage
	}

	fmt.Printf("Part 1: %v\n", total)
}

func part2() {
	total := 0
	for bank := range strings.SplitSeq(input, "\n") {
		batteries := strings.Split(bank, "")
		if len(batteries) == 0 {
			continue
		}

		turnedOnBatteries := make([]string, 12)
		lastIndex := 0
		for i := range turnedOnBatteries {
			// for each of the 12 slots, we need to find the highest
			// number in a specific range, which is determined
			// by how many batteries are left in the bank and how
			// many we have left to turn on
			// For example, for the first search, there are 15
			// batteries available and there are 12 left to turn on
			// still, so we need to find the highest of the first 3
			howManyBatteriesLeft := len(batteries) - lastIndex
			howManyLeftToTurnOn := 12 - i
			howManyToLookFor := howManyBatteriesLeft - howManyLeftToTurnOn

			highest, highestIndex := highest(batteries[lastIndex : lastIndex+howManyToLookFor+1])
			turnedOnBatteries[i] = highest
			lastIndex += highestIndex + 1
		}

		joltageString := ""
		for _, str := range turnedOnBatteries {
			joltageString += str
		}

		joltage, err := strconv.Atoi(joltageString)
		if err != nil {
			panic(err)
		}

		total += joltage
	}

	fmt.Printf("Part 2: %v\n", total)

}

func highest(arr []string) (string, int) {
	highest := 0
	highestIndex := -1
	for i, item := range arr {
		itemInt, err := strconv.Atoi(item)
		if err != nil {
			panic(err)
		}

		if itemInt > highest {
			highest = itemInt
			highestIndex = i
		}
	}

	return strconv.Itoa(highest), highestIndex
}
