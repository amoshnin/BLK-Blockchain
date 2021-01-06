import { GENESIS_DATA } from "./config"

export interface IBlockData {
  timestamp: number
  lastHash: string
  hash: string
  data: Array<string>
}

export default class Block {
  constructor(readonly props: IBlockData) {}

  static genesis() {
    return new Block(GENESIS_DATA)
  }
}
