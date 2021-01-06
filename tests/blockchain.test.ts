import Blockchain from "../src/blockchain"
import Block from "../src/block"

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
    describe("when the new chain is not longer", () => {
      it("doesn't replace the chain", () => {
        newChain.chain[0] = { new: "chain" } as any
        blockchain.replaceChain(newChain.chain)
        expect(blockchain.chain).toEqual(originalChain)
      })
    })

    describe("when the new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "Bears" })
        newChain.addBlock({ data: "Marshmellow" })
        newChain.addBlock({ data: "Galactics" })
      })

      describe("and the chain is invalid", () => {
        it("doesn't replace the chain", () => {
          newChain.chain[2].hash = "fake-hash"
          blockchain.replaceChain(newChain.chain)
          expect(blockchain.chain).toEqual(originalChain)
        })
      })
      describe("and the chain is valid", () => {
        it("replaces the chain", () => {
          blockchain.replaceChain(newChain.chain)
          expect(blockchain.chain).toEqual(newChain.chain)
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
        blockchain.chain[0] = { ...blockchain.chain[0], data: "fake-genesis" }
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
          blockchain.chain[2].data = "some-bad-and-evil-data"
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
