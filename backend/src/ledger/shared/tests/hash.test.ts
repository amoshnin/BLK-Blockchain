import { hasher } from ".."

describe("hash() Test", () => {
  const input = {
    input: "foo",
    output: "b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b",
  }

  it("generates a SHA-256 hashed output", () => {
    expect(hasher(input.input)).toEqual(input.output)
  })

  it("produces same hash with same input arguments in any order", () => {
    const nm = ["one", "two", "three"]

    expect(hasher(nm[2], nm[1], nm[0])).toEqual(hasher(nm[0], nm[2], nm[1]))
  })

  it("produces unique hash when properties have changed on an input", () => {
    const foo: { [key: string]: string } = {}
    const originalHash = hasher(foo)
    foo["a"] = "a"

    expect(hasher(foo)).not.toEqual(originalHash)
  })
})
