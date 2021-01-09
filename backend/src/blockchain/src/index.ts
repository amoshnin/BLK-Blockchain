// # PLUGINS IMPORTS //

// # COMPONENTS IMPORTS //
import Block, { IBlockData } from "./block"
import { hasher } from "../../shared"

/////////////////////////////////////////////////////////////////////////////

export default class Blockchain {
  chain: Array<IBlockData> = [Block.genesis()]

  constructor() {}

  static isValidChain(chain: Array<IBlockData>) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false
    }

    for (let i = 1; i < chain.length; i++) {
      const { hash, ...rest } = chain[i]
      const lastDifficulty = chain[i - 1].difficulty

      const prevBlockHash = chain[i - 1].hash
      if (prevBlockHash !== rest.lastHash) return false

      const validatedHash = hasher(...Object.values(rest))
      if (hash !== validatedHash) return false

      if (Math.abs(lastDifficulty - rest.difficulty) > 1) return false
    }

    return true
  }

  replaceChain(chain: Array<IBlockData>) {
    if (chain.length <= this.chain.length) {
      console.error("Incoming chain must be longer")
      return
    }

    if (!Blockchain.isValidChain(chain)) {
      console.error("The chain income must be valid")
      return
    }

    console.log("Replacing chain with", chain)
    this.chain = chain
  }

  addBlock({ data }: { data: any }) {
    const newBlock = Block.mineBlock({
      data,
      lastBlock: this.chain[this.chain.length - 1],
    })

    this.chain.push(newBlock)
  }
}
