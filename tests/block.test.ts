import Block, { IBlockData } from "../src/block"
import { GENESIS_DATA } from "../src/config"

describe("BlockTest", () => {
  const props: IBlockData = {
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
    const genesisBlock = Block.genesis()

    it("returns a Block instance", () => {
      expect(genesisBlock instanceof Block).toBe(true)
    })

    it("returns the genesis data", () => {
      expect(genesisBlock).toEqual({ props: GENESIS_DATA })
    })
  })

  describe("minedBlock()", () => {
    const lastBlock = Block.genesis().props
    const data = ["mined data"]

    const minedBlock = Block.minedBlock({ lastBlock, data })

    it("returns a Block instance", () => {
      expect(minedBlock instanceof Block).toBe(true)
    })

    it("sets the `lastHash` to be the `hash` of the last block", () => {
      expect(minedBlock.props.lastHash).toEqual(lastBlock.hash)
    })

    it("sets the `data`", () => {
      expect(minedBlock.props.data).toEqual(data)
    })

    it("sets a timestamp", () => {
      expect(minedBlock.props.timestamp).not.toEqual(undefined)
    })
  })
})
