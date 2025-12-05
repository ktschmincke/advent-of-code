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
	split := strings.Split(input, "\n\n")
	ranges := strings.Split(split[0], "\n")
	ingredients := strings.Split(split[1], "\n")

	total := 0
	for _, ingredient := range ingredients {
		fresh := false
		for _, r := range ranges {
			if len(ingredient) == 0 || len(r) == 0 {
				continue
			}

			if inRange(ingredient, r) {
				fresh = true
				break
			}
		}

		if fresh {
			total++
		}
	}

	fmt.Printf("Part 1: %v\n", total)
}

func part2() {
	split := strings.Split(input, "\n\n")
	ranges := strings.Split(split[0], "\n")

	uniqRangeMap := make(map[string]bool)

	for _, r := range ranges {
		r1Start, r1End := parseRange(r)

		for k := range uniqRangeMap {
			r2Start, r2End := parseRange(k)
			if inRange(fmt.Sprintf("%d", r1Start), k) {
				r1Start = r2End + 1
			}

			if inRange(fmt.Sprintf("%d", r1End), k) {
				r1End = r2Start - 1
			}

			if r1Start <= r2Start && r1End >= r2End {
				delete(uniqRangeMap, k)
			}
		}

		if r1Start <= r1End {
			uniqRangeMap[strconv.Itoa(r1Start)+"-"+strconv.Itoa(r1End)] = true
		}
	}

	total := 0
	for r := range uniqRangeMap {
		start, end := parseRange(r)
		total += end - start + 1
	}

	fmt.Printf("Part 2: %v\n", total)
}

func parseRange(r string) (int, int) {
	start, err := strconv.Atoi(strings.Split(r, "-")[0])
	if err != nil {
		panic(err)
	}

	end, err := strconv.Atoi(strings.Split(r, "-")[1])
	if err != nil {
		panic(err)
	}

	return start, end
}

func inRange(x, r string) bool {
	xInt, err := strconv.Atoi(x)
	if err != nil {
		panic(err)
	}

	start, end := parseRange(r)

	return xInt >= start && xInt <= end
}
