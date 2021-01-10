import TransactionPool from "../transaction-pool"
import Transaction from "../transaction"
import Wallet from "../wallet"

describe("TransactionPool Test", () => {
  let transactionPool: TransactionPool,
    transaction: Transaction,
    senderWallet: Wallet

  beforeEach(() => {
    senderWallet = new Wallet()
    transactionPool = new TransactionPool()
    transaction = new Transaction({
      recipient: "fake-recipient",
      senderWallet,
      amount: 50,
    })
  })

  describe("setTransaction()", () => {
    it("adds a transaction", () => {
      transactionPool.setTransaction(transaction)
      expect(transactionPool.transactionsMap[transaction.id]).toBe(transaction)
    })
  })

  describe("existingTransaction()", () => {
    it("returns an existing transcaction given an input address", () => {
      transactionPool.setTransaction(transaction)
      expect(
        transactionPool.existingTransaction({
          inputAddress: senderWallet.publicKey,
        })
      ).toBe(transaction)
    })
  })
})
