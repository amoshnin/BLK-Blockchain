// # PLUGINS IMPORTS //
import { v1 as uuid } from "uuid"
import { IOutputMap, IInput, ITransaction } from "./transaction.types"
import Wallet from "."
import { verifySignature } from "../shared"

// # COMPONENTS IMPORTS //

/////////////////////////////////////////////////////////////////////////////

export default class Transaction {
  id: string = uuid()
  input: IInput = {}
  outputMap: IOutputMap = {}

  constructor({ senderWallet, recipient, amount }: ITransaction) {
    this.outputMap = this.createOutputMap({
      senderWallet,
      recipient,
      amount,
    })

    this.input = this.createInput({ senderWallet, outputMap: this.outputMap })
  }

  static validateTransaction(transaction: Transaction) {
    const {
      input: { address, amount, signature },
      outputMap,
    } = transaction
    const outputTotal = Object.values(outputMap).reduce((acc, cur) => acc + cur)

    if (amount !== outputTotal) {
      console.error(`Invalid transaction from ${address}`)
      return false
    }

    if (
      !verifySignature({
        publicKey: address as any,
        data: outputMap,
        signature: signature as any,
      })
    ) {
      console.error(`Invalid transaction from ${address}`)
      return false
    }

    return true
  }

  createInput({
    senderWallet,
    outputMap,
  }: {
    senderWallet: Wallet
    outputMap: IOutputMap
  }): IInput {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputMap as any),
    }
  }

  createOutputMap({ senderWallet, recipient, amount }: ITransaction) {
    const outputMap: IOutputMap = {}

    outputMap[recipient] = amount
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount
    return outputMap
  }
}
