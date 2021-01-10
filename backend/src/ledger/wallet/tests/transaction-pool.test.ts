import TransactionPool, { ITransactionsMap } from "../transaction-pool"
import Transaction from "../transaction"
import Wallet from "../wallet"
import Blockchain from "../../blockchain/blockchain"

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

  describe("clear()", () => {
    it("clears the transactions", () => {
      transactionPool.clear()
      expect(transactionPool.transactionsMap).toEqual({})
    })
  })

  describe("clearBlockchainTransactions()", () => {
    it("clears the pool of any existing blockchain tramsactions", () => {
      const blockchain = new Blockchain()
      const expectedTransaction: ITransactionsMap = {}

      for (let i = 0; i < 6; i++) {
        const transaction = new Wallet().createTransaction({
          recipient: "food",
          amount: 20,
        })

        transactionPool.setTransaction(transaction)

        if (i % 2 === 0) {
          blockchain.addBlock({ data: [transaction] })
        } else {
          expectedTransaction[transaction.id] = transaction
        }
      }

      transactionPool.clearBlockchainTransactions({ chain: blockchain.chain })
      expect(transactionPool.transactionsMap).toEqual(expectedTransaction)
    })
  })
})
