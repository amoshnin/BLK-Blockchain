import { ec } from "elliptic"
import Wallet from "./wallet"

export interface IOutputs {
  [key: string]: number
}

export interface IInputs {
  timestamp?: number
  amount?: number
  address?: string
  signature?: ec.Signature
}

///// //// ////

export interface ICreateInput {
  senderWallet: Wallet
  outputs: IOutputs
}

export interface IUpdate {
  senderWallet: Wallet
  recipient: string
  amount: number
}
