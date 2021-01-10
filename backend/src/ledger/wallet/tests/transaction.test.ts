import Wallet from "../wallet"
import Transaction from "../transaction"
import { verifySignature } from "../../shared"
import { ec } from "elliptic"
import { MINING_REWARD, REWARD_INPUT } from "../../shared/constants"

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

  describe("outputs", () => {
    it("has an `outputs`", () => {
      expect(transaction).toHaveProperty("outputs")
    })

    it("outputs the amount to the recipient", () => {
      expect(transaction.outputs[recipient]).toEqual(amount)
    })

    it("outputs the remaining balance for the `senderWallet`", () => {
      expect(transaction.outputs[senderWallet.publicKey]).toEqual(
        senderWallet.balance - amount
      )
    })
  })

  describe("inputs", () => {
    it("has an `inputs", () => {
      expect(transaction).toHaveProperty("inputs")
    })

    it("has a `timestamp` in the inputs", () => {
      expect(transaction.inputs).toHaveProperty("timestamp")
    })

    it("sets the `amount` to the `senderWallet` balance", () => {
      expect(transaction.inputs.amount).toEqual(senderWallet.balance)
    })

    it("sets the `address` to the `senderWallet` publicKey", () => {
      expect(transaction.inputs.address).toEqual(senderWallet.publicKey)
    })

    it("signs the inputs", () => {
      const verification = verifySignature({
        publicKey: senderWallet.publicKey,
        signature: transaction.inputs.signature as any,
        data: transaction.outputs as any,
      })

      expect(verification).toBe(true)
    })
  })

  describe("validTransaction()", () => {
    let errorMock: any

    beforeEach(() => {
      errorMock = jest.fn()
      global.console.error = errorMock
    })

    describe("when the transaction is valid", () => {
      it("returns true", () => {
        expect(Transaction.validTransaction(transaction)).toBe(true)
      })
    })

    describe("when the transaction is invalid", () => {
      describe("and a transaction outputs value is invalid", () => {
        it("returns false and logs and error", () => {
          transaction.outputs[senderWallet.publicKey] = 9999999
          expect(Transaction.validTransaction(transaction)).toBe(false)
          expect(errorMock).toHaveBeenCalled()
        })
      })
      describe("and the transaction inputs signature is invalid", () => {
        it("returns false and logs and error", () => {
          transaction.inputs.signature = new Wallet().sign("data")
          expect(Transaction.validTransaction(transaction)).toBe(false)
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
        originalSignature = transaction.inputs.signature
        originalSenderOutput = transaction.outputs[senderWallet.publicKey]
        nextRecipient = "next-recipient"
        nextAmount = 4

        transaction.update({
          senderWallet,
          recipient: nextRecipient,
          amount: nextAmount,
        })
      })

      it("outputs the amount to the next recipient", () => {
        expect(transaction.outputs[nextRecipient]).toEqual(nextAmount)
      })

      it("subtracts the amount from the original sender outputs amount", () => {
        expect(transaction.outputs[senderWallet.publicKey]).toEqual(
          originalSenderOutput - nextAmount
        )
      })

      it("maintains a total outputs that matches the inputs amount", () => {
        const total = Object.values(transaction.outputs).reduce(
          (acc, cur) => acc + cur
        )

        expect(total).toEqual(transaction.inputs.amount)
      })

      it("re-signs the transaction", () => {
        expect(transaction.inputs.signature).not.toEqual(originalSignature)
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
          expect(transaction.outputs[nextRecipient]).toEqual(
            nextAmount + addedAmount
          )
        })

        it("subtracts the amount from the original sender outputs amount", () => {
          expect(transaction.outputs[senderWallet.publicKey]).toEqual(
            originalSenderOutput - nextAmount - addedAmount
          )
        })
      })
    })
  })

  describe("rewardTransaction()", () => {
    let rewardTransaction: Transaction, minerWallet: Wallet

    beforeEach(() => {
      minerWallet = new Wallet()
      rewardTransaction = Transaction.rewardTransaction({ minerWallet })
    })

    it("creates a transaction with the reward input", () => {
      expect(rewardTransaction.inputs).toEqual(REWARD_INPUT)
    })

    it("creates one transaction for the miner with the `MINING_REWARD`", () => {
      expect(rewardTransaction.outputs[minerWallet.publicKey]).toEqual(
        MINING_REWARD
      )
    })
  })
})
