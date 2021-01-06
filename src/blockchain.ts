import Block from "./block"

export default class Blockchain {
  chain = [Block.genesis()]

  constructor() {}

  addBlock({ data }: { data: any }) {
    const newBlock = Block.mineBlock({
      data,
      lastBlock: this.chain[this.chain.length - 1].props,
    })

    this.chain.push(newBlock)
  }
}
