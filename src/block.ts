import { GENESIS_DATA } from "./config"
import cryptoHash from "./utils/crypto-hash"

export interface IBlockData {
  timestamp: number
  lastHash: string
  hash: string
  data: Array<string>
}

interface IMineBlockInput {
  lastBlock: IBlockData
  data: Array<string>
}

export default class Block {
  constructor(readonly props: IBlockData) {}

  static genesis(): Block {
    return new this(GENESIS_DATA)
  }

  static mineBlock({ lastBlock, data }: IMineBlockInput) {
    const input = {
      data,
      timestamp: Date.now(),
      lastHash: lastBlock.hash,
    }

    const hash = cryptoHash(input)
    return new this({ ...input, hash })
  }
}
