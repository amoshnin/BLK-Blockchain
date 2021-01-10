// # PLUGINS IMPORTS //
import { ec } from "elliptic"
import { elliptic } from "../shared/functions/transactions-verifier"

// # COMPONENTS IMPORTS //
import { START_BALANCE } from "../shared/constants"
import { hasher } from "../shared"
import Transaction from "./transaction"
import { IBlockData } from "../shared/typings"

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
    let sum = 0

    for (let i = 0; i < chain.length; i++) {
      const block = chain[i]

      for (let transaction of block.data) {
        const outputAmount = transaction.outputs![address]

        if (outputAmount) {
          sum += outputAmount
        }
      }
    }

    return START_BALANCE + sum
  }

  sign(data: string) {
    const hash = hasher(data)
    return this.keyPair.sign(hash)
  }

  createTransaction({
    recipient,
    amount,
  }: {
    recipient: string
    amount: number
  }): Transaction {
    if (amount > this.balance) {
      throw new Error("Amount exceeds balance")
    }

    return new Transaction({ senderWallet: this, recipient, amount })
  }
}
