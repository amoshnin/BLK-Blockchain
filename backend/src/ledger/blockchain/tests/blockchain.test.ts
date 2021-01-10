import Blockchain from "../blockchain"
import Block from "../block"
import { hasher } from "../../shared"

describe("Blockchain Test", () => {
  let blockchain = new Blockchain()
  let newChain = new Blockchain()
  let originalChain: any

  beforeEach(() => {
    blockchain = new Blockchain()
    newChain = new Blockchain()
    originalChain = blockchain.chain
  })

  it("should contain a `chain` Array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true)
  })

  it("start with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis())
  })

  it("adds a new block to chain", () => {
    const newData = "foo bar"
    blockchain.addBlock({ data: newData })

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData)
  })

  describe("replaceChain()", () => {
    let errorMock: any, logMock: any

    beforeEach(() => {
      errorMock = jest.fn()
      logMock = jest.fn()

      global.console.error = errorMock
      global.console.log = logMock
    })

    describe("when the new chain is not longer", () => {
      beforeEach(() => {
        newChain.chain[0] = { new: "chain" } as any
        blockchain.replaceChain(newChain.chain)
      })

      it("doesn't replace the chain", () => {
        expect(blockchain.chain).toEqual(originalChain)
      })

      it("logs an error", () => {
        expect(errorMock).toHaveBeenCalled()
      })
    })

    describe("when the new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "Bears" })
        newChain.addBlock({ data: "Marshmellow" })
        newChain.addBlock({ data: "Galactics" })
      })

      describe("and the chain is invalid", () => {
        beforeEach(() => {
          newChain.chain[2].hash = "fake-hash"
          blockchain.replaceChain(newChain.chain)
        })

        it("doesn't replace the chain", () => {
          expect(blockchain.chain).toEqual(originalChain)
        })

        it("logs an error", () => {
          expect(errorMock).toHaveBeenCalled()
        })
      })
      describe("and the chain is valid", () => {
        beforeEach(() => blockchain.replaceChain(newChain.chain))

        it("replaces the chain", () => {
          expect(blockchain.chain).toEqual(newChain.chain)
        })

        it("logs anout the chain replacement", () => {
          expect(logMock).toHaveBeenCalled()
        })
      })
    })
  })

  describe("`isValidChain()", () => {
    beforeEach(() => {
      blockchain.addBlock({ data: "Bears" })
      blockchain.addBlock({ data: "Marshmellow" })
      blockchain.addBlock({ data: "Galactics" })
    })

    describe("when chain doesn't start with genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = {
          ...blockchain.chain[0],
          data: [{ id: "random" }],
        }
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
      })
    })

    describe("when the chain starts with genesis block and has multiple blocks", () => {
      describe("and a `lastHash` reference has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "broken-lastHassh"
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
        })
      })

      describe("and the chain contains a block with an invalid fied", () => {
        it("returns false", () => {
          blockchain.chain[2].data = [{ id: "evil-data" }]
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
        })
      })

      describe("and the chain contains a block with a jumped difficulty", () => {
        it("returns false", () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1]
          const lastHash = lastBlock.hash
          const timestamp = Date.now()
          const nonce = 0
          const data = [{ id: "" }]
          const difficulty = lastBlock.difficulty - 3

          const args = {
            timestamp,
            lastHash,
            nonce,
            difficulty,
            data,
          }
          const hash = hasher(...Object.values(args))
          const badBlock = new Block({ ...args, hash })
          blockchain.chain.push(badBlock)

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
        })
      })

      describe("and the chan doesn't contain any invalid blocks", () => {
        it("returns true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true)
        })
      })
    })
  })
})
