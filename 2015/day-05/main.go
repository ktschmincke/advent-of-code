package main

import (
	_ "embed"
	"fmt"
	"regexp"
	"strings"
)

//go:embed input.txt
var input string

func main() {
	part1()
	// part2()
}

func part1() {
	total := 0
	for line := range strings.SplitSeq(input, "\n") {
		if isNice(line) {
			total++
		}
	}
	fmt.Printf("Part 1: %v\n", total)
}

func part2() {
	fmt.Printf("Part 2: %v\n")
}

func isNice(s string) bool {
	vowelRe := regexp.MustCompile(`[aeiou]`)
	if len(vowelRe.FindAllString(s, -1)) < 3 {
		return false
	}

	doubleRe := regexp.MustCompile(`(aa|bb|cc|dd|ee|ff|gg|hh|ii|jj|kk|ll|mm|nn|oo|pp|qq|rr|ss|tt|uu|vv|ww|xx|yy|zz)`)
	if !doubleRe.MatchString(s) {
		return false
	}

	badRe := regexp.MustCompile(`ab|cd|pq|xy`)
	if badRe.MatchString(s) {
		return false
	}

	return true
}
