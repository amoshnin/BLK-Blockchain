// # PLUGINS IMPORTS //
import { v1 as uuid } from "uuid"

// # COMPONENTS IMPORTS //

// # EXTRA IMPORTS //
import { verifySignature } from "../shared"
import { MINING_REWARD, REWARD_INPUT } from "../shared/constants"
import { ITransaction } from "../shared/typings"
import { IOutputs, IInputs, ICreateInput, IUpdate } from "./transaction.types"
import Wallet from "./wallet"

/////////////////////////////////////////////////////////////////////////////

export default class Transaction {
  id: string = uuid()
  inputs: IInputs = {}
  outputs: IOutputs = {}

  constructor({
    senderWallet,
    recipient,
    amount,
    inputs,
    outputs,
  }: ITransaction) {
    if (senderWallet && recipient && amount) {
      this.outputs = this._createOutputs({
        senderWallet,
        recipient,
        amount,
      })

      this.inputs =
        inputs || this._createInput({ senderWallet, outputs: this.outputs })
    }

    if (outputs && inputs) {
      this.outputs = outputs

      this.inputs = inputs
    }
  }

  static validTransaction(transaction: Transaction) {
    const {
      inputs: { address, amount, signature },
      outputs,
    } = transaction
    const outputsTotal = Object.values(outputs).reduce((acc, cur) => acc + cur)

    if (amount !== outputsTotal) {
      console.error(`Invalid transaction from ${address}`)
      return false
    }

    if (
      !verifySignature({
        publicKey: address as any,
        data: outputs,
        signature: signature as any,
      })
    ) {
      console.error(`Invalid transaction from ${address}`)
      return false
    }

    return true
  }

  static rewardTransaction({ minerWallet }: { minerWallet: Wallet }) {
    return new this({
      inputs: REWARD_INPUT,
      outputs: { [minerWallet.publicKey]: MINING_REWARD },
    })
  }

  update({ senderWallet, recipient, amount }: IUpdate) {
    if (amount > this.outputs[senderWallet.publicKey]) {
      throw new Error("Amount exceeds the balance")
    }

    if (!this.outputs[recipient]) {
      this.outputs[recipient] = amount
    } else {
      this.outputs[recipient] += amount
    }

    this.outputs[senderWallet.publicKey] -= amount
    this.inputs = this._createInput({ senderWallet, outputs: this.outputs })
  }

  private _createInput({ senderWallet, outputs }: ICreateInput): IInputs {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputs as any),
    }
  }

  private _createOutputs({
    senderWallet,
    recipient,
    amount,
  }: ITransaction): IOutputs {
    const outputs: IOutputs = {}

    if (amount && recipient && senderWallet) {
      outputs[recipient] = amount
      outputs[senderWallet.publicKey] = senderWallet.balance - amount
      return outputs
    }

    return {}
  }
}
