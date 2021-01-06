import Blockchain from "../src/blockchain"
import Block from "../src/block"

describe("Blockchain Test", () => {
  const blockchain = new Blockchain()

  it("should contain a `chain` Array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true)
  })

  it("start with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis())
  })

  it("adds a new block to chain", () => {
    const newData = "foo bar"
    blockchain.addBlock({ data: newData })

    expect(blockchain.chain[blockchain.chain.length - 1].props.data).toEqual(
      newData
    )
  })
})
