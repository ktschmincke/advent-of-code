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
	curr := 50
	total0s := 0
	for line := range strings.SplitSeq(input, "\n") {
		if line == "" {
			continue
		}

		dir := string(line[0])
		clicks, err := strconv.Atoi(line[1:])
		if err != nil {
			panic(err)
		}

		if dir == "L" {
			curr = (((curr - clicks) % 100) + 100) % 100
		} else if dir == "R" {
			curr = (curr + clicks) % 100
		}

		if curr == 0 {
			total0s += 1
		}
	}

	fmt.Println(total0s)

}

func part2() {
	curr := 50
	total0s := 0
	for line := range strings.SplitSeq(input, "\n") {
		if line == "" {
			continue
		}

		dir := string(line[0])
		clicks, err := strconv.Atoi(line[1:])
		if err != nil {
			panic(err)
		}

		for range clicks {
			if dir == "L" {
				curr -= 1
				if curr < 0 {
					curr = 99
				}

				if curr == 0 {
					total0s += 1
				}

			} else if dir == "R" {
				curr += 1
				if curr > 99 {
					curr = 0
				}

				if curr == 0 {
					total0s += 1
				}
			}
		}
	}

	fmt.Println(total0s)
}
