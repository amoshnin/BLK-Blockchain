// # PLUGINS IMPORTS //
import { ec } from "elliptic"
import { elliptic } from "../shared/functions/transactions-verifier"

// # COMPONENTS IMPORTS //
import Transaction from "./transaction"

// # EXTRA IMPORTS //
import { START_BALANCE } from "../shared/constants"
import { IBlockData } from "../shared/typings"
import { hasher } from "../shared"

/////////////////////////////////////////////////////////////////////////////

interface ICalculateBalanceInput {
  chain: Array<IBlockData>
  address: string
}

export default class Wallet {
  balance: number
  publicKey: string
  keyPair: ec.KeyPair

  constructor() {
    this.balance = START_BALANCE

    this.keyPair = elliptic.genKeyPair()
    this.publicKey = this.keyPair.getPublic().encode("hex", true)
  }

  static calculateBalance({ chain, address }: ICalculateBalanceInput) {
    let hasConductedTransaction = false
    let sum = 0

    for (let i = chain.length - 1; i > 0; i--) {
      const block = chain[i]

      for (let transaction of block.data) {
        if (transaction.inputs?.address === address) {
          hasConductedTransaction = true
        }

        const outputAmount = transaction.outputs![address]

        if (outputAmount) {
          sum += outputAmount
        }
      }

      if (hasConductedTransaction) {
        break
      }
    }

    return hasConductedTransaction ? sum : START_BALANCE + sum
  }

  sign(data: any) {
    const hash = hasher(data)
    return this.keyPair.sign(hash)
  }

  createTransaction({
    recipient,
    amount,
    chain,
  }: {
    recipient: string
    amount: number
    chain?: Array<IBlockData>
  }): Transaction {
    if (chain) {
      this.balance = Wallet.calculateBalance({ chain, address: this.publicKey })
    }

    if (amount > this.balance) {
      throw new Error("Amount exceeds balance")
    }

    return new Transaction({ senderWallet: this, recipient, amount })
  }
}
