// # PLUGINS IMPORTS //
import { ec } from "elliptic"
import { elliptic } from "../shared/transactions-verifier"

// # COMPONENTS IMPORTS //
import { START_BALANCE } from "./config"
import { hasher } from "../shared"

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
}
