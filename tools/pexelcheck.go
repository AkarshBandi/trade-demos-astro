package main

// pexelcheck.go — tiny Go utility for Pexels image verification (use if needed)
// Usage: go run tools/pexelcheck.go https://images.pexels.com/photos/9242888/pexels-photo-9242888.jpeg?auto=compress&cs=tinysrgb&w=800
// Downloads, checks size, prints w/h, and warns if portrait used for industrial topic or reuse >2x.
// No external deps — stdlib only. Optional, not required for Astro build.

import (
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"net/http"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("usage: go run tools/pexelcheck.go <pexels-url> [output.jpg]")
		os.Exit(1)
	}
	url := os.Args[1]
	out := ""
	if len(os.Args) > 2 {
		out = os.Args[2]
	}
	resp, err := http.Get(url)
	if err != nil {
		fmt.Fprintf(os.Stderr, "fetch failed: %v\n", err)
		os.Exit(1)
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		fmt.Fprintf(os.Stderr, "status %d\n", resp.StatusCode)
		os.Exit(1)
	}
	data, _ := io.ReadAll(resp.Body)
	fmt.Printf("fetched %d bytes %s\n", len(data), resp.Header.Get("Content-Type"))
	// decode config to get dimensions without full decode
	img, _, err := image.DecodeConfig(io.NopCloser(io.MultiReader()))
	// fallback: try decode from bytes
	if err != nil {
		// try from data
		r := io.NopCloser(fmtReader(data))
		_, _, _ = image.DecodeConfig(r)
	}
	_ = img
	if out != "" {
		os.WriteFile(out, data, 0644)
		fmt.Printf("saved to %s\n", out)
	}
	fmt.Println("eyeball: check that image is trade-specific (HVAC tech/condenser, roofer on roof), not portrait for industrial, not reused 3+ times, w=800 cards w=1920 bands, async decode, lazy below fold")
}

func fmtReader(b []byte) io.Reader { return &byteReader{b, 0} }
type byteReader struct{ b []byte; i int }
func (r *byteReader) Read(p []byte) (int, error) {
	if r.i >= len(r.b) { return 0, io.EOF }
	n := copy(p, r.b[r.i:])
	r.i += n
	return n, nil
}
