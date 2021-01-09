import { IBlockData } from "../src/block"

export const MINE_RATE = 1000
const INITIAL_DIFFICULTY = 3

export const GENESIS_DATA: IBlockData = {
  timestamp: 1,
  lastHash: "-----",
  hash: "hash-one",
  data: "",
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
}
