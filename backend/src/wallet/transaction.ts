// # PLUGINS IMPORTS //
import { v1 as uuid } from "uuid"
import { IOutputMap, IInput, ITransaction } from "./transaction.types"
import Wallet from "."

// # COMPONENTS IMPORTS //

/////////////////////////////////////////////////////////////////////////////

export default class Transaction {
  id: string = uuid()
  outputMap: IOutputMap = {}
  input: IInput = {}

  constructor({ senderWallet, recipient, amount }: ITransaction) {
    this.outputMap = this.createOutputMap({
      senderWallet,
      recipient,
      amount,
    })

    this.input = this.createInput({ senderWallet, outputMap: this.outputMap })
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
