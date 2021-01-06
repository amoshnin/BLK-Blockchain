import { GENESIS_DATA } from "./config"

export interface IBlockData {
  timestamp: number
  lastHash: string
  hash: string
  data: Array<string>
}

export default class Block {
  constructor(readonly props: IBlockData) {}

  static genesis(): Block {
    return new this(GENESIS_DATA)
  }

  static minedBlock({
    lastBlock,
    data,
  }: {
    lastBlock: IBlockData
    data: Array<string>
  }) {
    return new this({
      data,
      timestamp: Date.now(),
      lastHash: lastBlock.hash,
      hash: "dsadsa",
    })
  }
}
