// @ts-ignore
import hexToBinary from "hex-to-binary"
import Block from "../block"
import { GENESIS_DATA, MINE_RATE } from "../../shared/constants"

describe("BlockTest", () => {
  const { timestamp, lastHash, hash, data, nonce, difficulty } = {
    timestamp: 2000,
    lastHash: "foo-hash",
    hash: "bar-hash",
    data: [],
    nonce: 1,
    difficulty: 4,
  }
  const block = new Block({
    timestamp,
    lastHash,
    hash,
    data,
    nonce,
    difficulty,
  })

  describe("adjustDifficulty", () => {
    it("raises difficulty for quickly mined block", () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE - 100,
        })
      ).toEqual(block.difficulty + 1)
    })

    it("lowers difficulty for slowly mined block", () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE + 100,
        })
      ).toEqual(block.difficulty - 1)
    })
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

  describe("mineBlock()", () => {
    const data = [{ id: "" }]
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

    it("creates a SHA-256 `hash` based on proper inputs", () => {})

    it("sets a `hash` that matches the difficulty criteria", () => {
      console.log(hexToBinary(minedBlock.hash))
      expect(
        hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)
      ).toEqual("0".repeat(minedBlock.difficulty))
    })

    it("adjusts the difficulty", () => {
      const possibleResults = [
        lastBlock.difficulty + 1,
        lastBlock.difficulty - 1,
      ]

      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true)
    })

    it("has a lower limit of 1", () => {
      block.difficulty = -1
      expect(
        Block.adjustDifficulty({ originalBlock: block, timestamp: Date.now() })
      ).toEqual(1)
    })
  })
})
