import cryptoHash from "../src/crypto-hash"

describe("cryptoHash() Test", () => {
  const info = {
    input: "foo",
    output: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
  }

  it("generates a SHA-256 hashed output", () => {
    expect(cryptoHash(info.input)).toEqual(info.output)
  })

  it("produces same hash with same input arguments in any order", () => {
    const nm = ["one", "two", "three"]

    expect(cryptoHash(nm[2], nm[1], nm[0])).toEqual(
      cryptoHash(nm[0], nm[2], nm[1])
    )
  })
})
