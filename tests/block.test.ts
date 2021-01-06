import Block from "../src/block"
import { GENESIS_DATA } from "../src/config"

describe("BlockTest", () => {
  const props = {
    timestamp: Date.now(),
    lastHash: "dsa",
    hash: "dsadsa",
    data: ["data"],
  }

  const block = new Block(props)

  it("has all properties (timestamp, lastHash, hash, data)", () => {
    expect(block.props).toEqual(props)
  })

  describe("genesis()", () => {
    const genesisBlock: any = Block.genesis()

    it("returns a Block instance", () => {
      expect(genesisBlock instanceof Block).toBe(true)
    })

    it("returns the genesis data", () => {
      expect(genesisBlock).toEqual({ props: GENESIS_DATA })
    })
  })
})
