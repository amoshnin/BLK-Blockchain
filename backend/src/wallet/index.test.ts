import Wallet from "."
import { verifySignature } from "../shared"
import Transaction from "./transaction"

describe("Wallet Test", () => {
  let wallet: Wallet

  beforeEach(() => {
    wallet = new Wallet()
  })

  it("has a `balance`", () => {
    expect(wallet).toHaveProperty("balance")
  })

  it("has a `public key", () => {
    expect(wallet).toHaveProperty("publicKey")
  })

  describe("signing data", () => {
    const data = "foobar"

    it("verifies a signature", () => {
      const result = verifySignature({
        publicKey: wallet.publicKey,
        signature: wallet.sign(data),
        data,
      })

      expect(result).toBe(true)
    })

    it("doesn't verify invalid signature", () => {
      const result = verifySignature({
        publicKey: wallet.publicKey,
        signature: new Wallet().sign(data),
        data,
      })

      expect(result).toBe(false)
    })
  })
})
