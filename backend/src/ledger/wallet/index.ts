// # PLUGINS IMPORTS //
import { ec } from "elliptic"
import { elliptic } from "../shared/src/transactions-verifier"

// # COMPONENTS IMPORTS //
import { START_BALANCE } from "./constants"
import { hasher } from "../shared"
import Transaction from "./transaction"

/////////////////////////////////////////////////////////////////////////////

export default class Wallet {
  balance: number
  publicKey: string
  keyPair: ec.KeyPair

  constructor() {
    this.balance = START_BALANCE

    this.keyPair = elliptic.genKeyPair()
    this.publicKey = this.keyPair.getPublic().encode("hex", true)
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
  }) {
    if (amount > this.balance) {
      throw new Error("Amount exceeds balance")
    }

    return new Transaction({ senderWallet: this, recipient, amount })
  }
}
