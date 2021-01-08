// # PLUGINS IMPORTS //
// @ts-ignore
import hexToBinary from "hex-to-binary"

// # COMPONENTS IMPORTS //
import { GENESIS_DATA, MINE_RATE } from "./config"
import cryptoHash from "./utils/crypto-hash"

/////////////////////////////////////////////////////////////////////////////

export interface IBlockData {
  timestamp: number
  lastHash: string
  hash: string
  data: string
  nonce: number
  difficulty: number
}

interface IMineBlockInput {
  lastBlock: IBlockData
  data: string
}

interface IDifficultyInput {
  originalBlock: IBlockData
  timestamp: number
}

export default class Block {
  data = ""
  hash = ""
  lastHash = ""
  timestamp: number = 0
  difficulty: number = 0
  nonce: number = 0

  constructor({
    data,
    hash,
    lastHash,
    timestamp,
    difficulty,
    nonce,
  }: IBlockData) {
    this.data = data
    this.hash = hash
    this.lastHash = lastHash
    this.timestamp = timestamp
    this.difficulty = difficulty
    this.nonce = nonce
  }

  static genesis(): Block {
    return new this(GENESIS_DATA)
  }

  static mineBlock({ lastBlock, data }: IMineBlockInput) {
    const { hash: lastBlockHash, difficulty: lastBlockDifficulty } = lastBlock
    let difficulty = lastBlockDifficulty
    let hash,
      timestamp,
      nonce = 0

    do {
      nonce++
      timestamp = Date.now()
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timestamp,
      })
      hash = cryptoHash(data, timestamp, lastBlockHash, nonce, difficulty)
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    )

    return new this({
      data,
      timestamp,
      difficulty,
      nonce,
      hash,
      lastHash: lastBlockHash,
    })
  }

  static adjustDifficulty({ originalBlock, timestamp }: IDifficultyInput) {
    const { difficulty } = originalBlock

    if (difficulty < 1) return 1
    if (timestamp - originalBlock.timestamp > MINE_RATE) {
      return difficulty - 1
    } else {
      return difficulty + 1
    }
  }
}
