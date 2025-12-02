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
	total := 0
	for idRange := range strings.SplitSeq(input, ",") {
		strSplit := strings.Split(idRange, "-")
		curr, err := strconv.Atoi(strings.TrimSpace(strSplit[0]))
		if err != nil {
			panic(err)
		}

		last, err := strconv.Atoi(strings.TrimSpace(strSplit[1]))
		if err != nil {
			panic(err)
		}

		for curr <= last {
			currStr := strconv.Itoa(curr)

			// for a pattern to repeat twice, the ID must have
			// an even number of characters
			if len(currStr)%2 != 0 {
				curr += 1
				continue
			}

			mid := len(currStr) / 2
			firstHalf := currStr[:mid]
			secondHalf := currStr[mid:]

			if firstHalf == secondHalf {
				total += curr
			}

			curr += 1
		}
	}

	fmt.Printf("Part 1: %v\n", total)
}

func part2() {
	total := 0
	for idRange := range strings.SplitSeq(input, ",") {
		strSplit := strings.Split(idRange, "-")
		curr, err := strconv.Atoi(strings.TrimSpace(strSplit[0]))
		if err != nil {
			panic(err)
		}

		last, err := strconv.Atoi(strings.TrimSpace(strSplit[1]))
		if err != nil {
			panic(err)
		}

		for curr <= last {
			currStr := strconv.Itoa(curr)

			// build up a list of all substrings
			var patterns []string
			for i, c := range currStr {
				if i == 0 {
					patterns = append(patterns, string(c))
				} else {
					patterns = append(patterns, patterns[i-1]+string(c))
				}
			}

			// for each substring, count matches in the string
			for _, pattern := range patterns {
				re := regexp.MustCompile(pattern)
				matches := re.FindAllStringIndex(currStr, -1)
				if len(matches) >= 2 {
					isMatch := true
					for i, match := range matches {
						if i == 0 {
							continue
						}

						// check no gaps in match indicies
						if match[0] != matches[i-1][1] {
							isMatch = false
							break
						}
					}

					// check pattern covers full string
					if isMatch && matches[0][0] == 0 && matches[len(matches)-1][1] == len(currStr) {
						total += curr
						break
					}
				}
			}

			curr += 1
		}
	}

	fmt.Printf("Part 2: %v\n", total)
}
