package main

import (
	"crypto/md5"
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
	for i := range 100000000 {
		hash := md5.Sum([]byte(fmt.Sprintf("%s%d", strings.TrimSpace(input), i)))
		if match, _ := regexp.MatchString(`^000000`, fmt.Sprintf("%x", hash)); match {
			fmt.Printf("Part 1: %v\n", i)
			break
		}
	}
}

func part2() {
	fmt.Printf("Part 2: %v\n")
}
