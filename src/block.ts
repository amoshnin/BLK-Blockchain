import { GENESIS_DATA } from "./config"
import cryptoHash from "./utils/crypto-hash"

export interface IBlockData {
  timestamp: number
  lastHash: string
  hash: string
  data: string
}

interface IMineBlockInput {
  lastBlock: IBlockData
  data: string
}

export default class Block {
  data = ""
  hash = ""
  lastHash = ""
  timestamp: number = 0

  constructor({ data, hash, lastHash, timestamp }: IBlockData) {
    this.data = data
    this.hash = hash
    this.lastHash = lastHash
    this.timestamp = timestamp
  }

  static genesis(): Block {
    return new this(GENESIS_DATA)
  }

  static mineBlock({ lastBlock, data }: IMineBlockInput) {
    const hash = cryptoHash(data, Date.now(), lastBlock.hash)
    return new this({
      data,
      timestamp: Date.now(),
      lastHash: lastBlock.hash,
      hash,
    })
  }
}
