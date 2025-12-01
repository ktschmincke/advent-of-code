package main

import (
	_ "embed"
	"fmt"
)

//go:embed input.txt
var input string

func main() {
	floor := 0
	for i, c := range input {
		if c == '(' {
			floor++
		} else if c == ')' {
			floor--
		}

		if floor < 0 {
			fmt.Println("Position:", i+1)
			break
		}
	}

	fmt.Println("Final floor:", floor)
}
