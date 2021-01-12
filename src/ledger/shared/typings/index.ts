import { IInputs, IOutputs } from "../../wallet/transaction.types"
import Wallet from "../../wallet/wallet"

export interface IBlockData {
  timestamp: number
  lastHash: string
  hash: string
  data: Array<ITransaction>
  nonce: number
  difficulty: number
}

export interface ITransaction {
  id?: string
  senderWallet?: Wallet
  recipient?: string
  amount?: number

  inputs?: IInputs
  outputs?: IOutputs
}
