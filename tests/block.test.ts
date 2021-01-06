import Block, { IBlockData } from "../src/block"
import cryptoHash from "../src/utils/crypto-hash"
import { GENESIS_DATA } from "../src/config"

describe("BlockTest", () => {
  const input: IBlockData = {
    timestamp: Date.now(),
    lastHash: "dsa",
    hash: "dsadsa",
    data: "data",
  }

  const block = new Block(input)

  it("has all properties (timestamp, lastHash, hash, data)", () => {
    expect(block).toEqual(input)
  })

  describe("genesis()", () => {
    const genesisBlock = Block.genesis()

    it("returns a Block instance", () => {
      expect(genesisBlock instanceof Block).toBe(true)
    })

    it("returns the genesis data", () => {
      expect(genesisBlock).toEqual(GENESIS_DATA)
    })
  })

  describe("minedBlock()", () => {
    const data = "mined data"
    const lastBlock = Block.genesis()
    const minedBlock = Block.mineBlock({ lastBlock, data })

    it("returns a Block instance", () => {
      expect(minedBlock instanceof Block).toBe(true)
    })

    it("sets the `lastHash` to be the `hash` of the last block", () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash)
    })

    it("sets the `data`", () => {
      expect(minedBlock.data).toEqual(data)
    })

    it("sets a timestamp", () => {
      expect(minedBlock.timestamp).not.toEqual(undefined)
    })

    it("creates a SHA-256 `hash` based on proper inputs", () => {
      const input = {
        timestamp: minedBlock.timestamp,
        hash: lastBlock.hash,
        data,
      }

      expect(minedBlock.hash).toEqual(cryptoHash(...Object.values(input)))
    })
  })
})
