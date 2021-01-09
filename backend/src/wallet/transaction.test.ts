import Wallet from "."
import { verifySignature } from "../shared"
import Transaction from "./transaction"

describe("Transaction test", () => {
  let transaction: Transaction,
    senderWallet: Wallet,
    recipient: string,
    amount: number

  beforeEach(() => {
    senderWallet = new Wallet()
    recipient = "recipient-public-key"
    amount = 2

    transaction = new Transaction({ senderWallet, recipient, amount })
  })

  it("has an `id`", () => {
    expect(transaction).toHaveProperty("id")
  })

  describe("outputMap", () => {
    it("has an `outputMap`", () => {
      expect(transaction).toHaveProperty("outputMap")
    })

    it("outputs the amount to the recipient", () => {
      expect(transaction.outputMap[recipient]).toEqual(amount)
    })

    it("outputs the remaining balance for the `senderWallet`", () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
        senderWallet.balance - amount
      )
    })
  })

  describe("input", () => {
    it("has an `input", () => {
      expect(transaction).toHaveProperty("input")
    })

    it("has a `timestamp` in the input", () => {
      expect(transaction.input).toHaveProperty("timestamp")
    })

    it("sets the `amount` to the `senderWallet` balance", () => {
      expect(transaction.input.amount).toEqual(senderWallet.balance)
    })

    it("sets the `address` to the `senderWallet` publicKey", () => {
      expect(transaction.input.address).toEqual(senderWallet.publicKey)
    })

    it("signs the input", () => {
      const verification = verifySignature({
        publicKey: senderWallet.publicKey,
        signature: transaction.input.signature as any,
        data: transaction.outputMap as any,
      })

      expect(verification).toBe(true)
    })
  })
})
