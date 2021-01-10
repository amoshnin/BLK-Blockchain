import Wallet from ".."
import Transaction from "../transaction"
import { verifySignature } from "../../shared"
import { ec } from "elliptic"

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

  describe("output", () => {
    it("has an `output`", () => {
      expect(transaction).toHaveProperty("output")
    })

    it("outputs the amount to the recipient", () => {
      expect(transaction.output[recipient]).toEqual(amount)
    })

    it("outputs the remaining balance for the `senderWallet`", () => {
      expect(transaction.output[senderWallet.publicKey]).toEqual(
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
        data: transaction.output as any,
      })

      expect(verification).toBe(true)
    })
  })

  describe("validateTransaction()", () => {
    let errorMock: any

    beforeEach(() => {
      errorMock = jest.fn()
      global.console.error = errorMock
    })

    describe("when the transaction is valid", () => {
      it("returns true", () => {
        expect(Transaction.validateTransaction(transaction)).toBe(true)
      })
    })

    describe("when the transaction is invalid", () => {
      describe("and a transaction output value is invalid", () => {
        it("returns false and logs and error", () => {
          transaction.output[senderWallet.publicKey] = 9999999
          expect(Transaction.validateTransaction(transaction)).toBe(false)
          expect(errorMock).toHaveBeenCalled()
        })
      })
      describe("and the transaction input signature is invalid", () => {
        it("returns false and logs and error", () => {
          transaction.input.signature = new Wallet().sign("data")
          expect(Transaction.validateTransaction(transaction)).toBe(false)
          expect(errorMock).toHaveBeenCalled()
        })
      })
    })
  })

  describe("update()", () => {
    let originalSignature: ec.Signature | undefined,
      originalSenderOutput: number,
      nextRecipient: string,
      nextAmount: number

    describe("and the amount is invalid", () => {
      it("throws an error", () => {
        expect(() =>
          transaction.update({
            senderWallet,
            recipient: "foo",
            amount: 99999,
          })
        ).toThrow()
      })
    })

    describe("and the amount is valid", () => {
      beforeEach(() => {
        originalSignature = transaction.input.signature
        originalSenderOutput = transaction.output[senderWallet.publicKey]
        nextRecipient = "next-recipient"
        nextAmount = 4

        transaction.update({
          senderWallet,
          recipient: nextRecipient,
          amount: nextAmount,
        })
      })

      it("outputs the amount to the next recipient", () => {
        expect(transaction.output[nextRecipient]).toEqual(nextAmount)
      })

      it("subtracts the amount from the original sender output amount", () => {
        expect(transaction.output[senderWallet.publicKey]).toEqual(
          originalSenderOutput - nextAmount
        )
      })

      it("maintains a total output that matches the input amount", () => {
        const total = Object.values(transaction.output).reduce(
          (acc, cur) => acc + cur
        )

        expect(total).toEqual(transaction.input.amount)
      })

      it("re-signs the transaction", () => {
        expect(transaction.input.signature).not.toEqual(originalSignature)
      })

      describe("and another update for same recipient", () => {
        let addedAmount: number

        beforeEach(() => {
          addedAmount = 3

          transaction.update({
            senderWallet,
            recipient: nextRecipient,
            amount: addedAmount,
          })
        })

        it("added to the recipient amount", () => {
          expect(transaction.output[nextRecipient]).toEqual(
            nextAmount + addedAmount
          )
        })

        it("subtracts the amount from the original sender output amount", () => {
          expect(transaction.output[senderWallet.publicKey]).toEqual(
            originalSenderOutput - nextAmount - addedAmount
          )
        })
      })
    })
  })
})
