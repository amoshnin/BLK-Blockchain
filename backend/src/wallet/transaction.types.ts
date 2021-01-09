import { ec } from "elliptic"
import Wallet from "."

export interface ITransaction {
  senderWallet: Wallet
  recipient: string
  amount: number
}

export interface IOutputMap {
  [key: string]: number
}

export interface IInput {
  timestamp?: number
  amount?: number
  address?: string
  signature?: ec.Signature
}
