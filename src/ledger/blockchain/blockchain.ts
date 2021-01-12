// # PLUGINS IMPORTS //

// # COMPONENTS IMPORTS //
import { hasher } from "../shared"
import { IBlockData } from "../shared/typings"
import { MINING_REWARD, REWARD_INPUT } from "../shared/constants"

import Block from "./block"
import Wallet from "../wallet/wallet"
import Transaction from "../wallet/transaction"

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

  validTransactionData({ chain }: { chain: Array<IBlockData> }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]
      const transactionSet = new Set()
      let rewardTransactionCount = 0

      for (let transaction of block.data) {
        if (transaction.inputs?.address === REWARD_INPUT.address) {
          rewardTransactionCount += 1

          if (rewardTransactionCount > 1) {
            console.error("Miner rewards exceed limit")
            return false
          }

          if (
            Object.values(transaction.outputs as object)[0] !== MINING_REWARD
          ) {
            console.error("Miner reward amount is invalid")
            return false
          }
        } else {
          if (!Transaction.validTransaction(transaction as Transaction)) {
            console.error("Invalid transaction")
            return false
          }

          const trueBalance = Wallet.calculateBalance({
            chain: this.chain,
            address: transaction.inputs?.address as string,
          })

          if (transaction.inputs?.amount !== trueBalance) {
            console.error("Invalid input amount")
            return false
          }

          if (transactionSet.has(transaction)) {
            console.error(
              "An identical transaction appears more than once in the block"
            )
            return false
          } else {
            transactionSet.add(transaction)
          }
        }
      }
    }

    return true
  }

  replaceChain(
    chain: Array<IBlockData>,
    isValidationEnabled?: boolean,
    onSuccess?: () => void
  ) {
    if (isValidationEnabled && !this.validTransactionData({ chain })) {
      console.error("The incoming chain has invalid transaction data")
      return
    }

    if (chain.length <= this.chain.length) {
      console.error("Incoming chain must be longer")
      return
    }

    if (!Blockchain.isValidChain(chain)) {
      console.error("The chain income must be valid")
      return
    }

    onSuccess && onSuccess()
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
