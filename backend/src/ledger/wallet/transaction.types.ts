import { ec } from "elliptic"
import Wallet from "."

export interface ITransaction {
  senderWallet: Wallet
  recipient: string
  amount: number
}

export interface IOutput {
  [key: string]: number
}

export interface IInput {
  timestamp?: number
  amount?: number
  address?: string
  signature?: ec.Signature
}

///// //// ////

export interface ICreateInput {
  senderWallet: Wallet
  output: IOutput
}

export interface IUpdate {
  senderWallet: Wallet
  recipient: string
  amount: number
}
