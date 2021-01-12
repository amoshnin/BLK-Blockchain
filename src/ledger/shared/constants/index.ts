import { IBlockData } from "../typings"

export const START_BALANCE = 1000
export const MINE_RATE = 1000
const INITIAL_DIFFICULTY = 3

export const REWARD_INPUT = { address: "*authorized-reward*" }
export const MINING_REWARD = 50

////// /////// ///////

export const GENESIS_DATA: IBlockData = {
  timestamp: 1,
  lastHash: "-----",
  hash: "hash-one",
  data: [],
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
}
