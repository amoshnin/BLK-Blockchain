import Blockchain from "../blockchain"
import Block from "../block"
import { hasher } from "../../shared"
import Transaction from "../../wallet/transaction"
import Wallet from "../../wallet/wallet"

describe("Blockchain Test", () => {
  let blockchain = new Blockchain()
  let newChain = new Blockchain()
  let originalChain: any, errorMock: any

  beforeEach(() => {
    blockchain = new Blockchain()
    newChain = new Blockchain()
    errorMock = jest.fn()

    originalChain = blockchain.chain
    global.console.error = errorMock
  })

  it("should contain a `chain` Array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true)
  })

  it("start with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis())
  })

  it("adds a new block to chain", () => {
    const newData = "foo bar"
    blockchain.addBlock({ data: newData })

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData)
  })

  describe("replaceChain()", () => {
    let logMock: any

    beforeEach(() => {
      logMock = jest.fn()
      global.console.log = logMock
    })

    describe("when the new chain is not longer", () => {
      beforeEach(() => {
        newChain.chain[0] = { new: "chain" } as any
        blockchain.replaceChain(newChain.chain)
      })

      it("doesn't replace the chain", () => {
        expect(blockchain.chain).toEqual(originalChain)
      })

      it("logs an error", () => {
        expect(errorMock).toHaveBeenCalled()
      })
    })

    describe("when the new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "Bears" })
        newChain.addBlock({ data: "Marshmellow" })
        newChain.addBlock({ data: "Galactics" })
      })

      describe("and the chain is invalid", () => {
        beforeEach(() => {
          newChain.chain[2].hash = "fake-hash"
          blockchain.replaceChain(newChain.chain)
        })

        it("doesn't replace the chain", () => {
          expect(blockchain.chain).toEqual(originalChain)
        })

        it("logs an error", () => {
          expect(errorMock).toHaveBeenCalled()
        })
      })

      describe("and the chain is valid", () => {
        beforeEach(() => blockchain.replaceChain(newChain.chain))

        it("replaces the chain", () => {
          expect(blockchain.chain).toEqual(newChain.chain)
        })

        it("logs anout the chain replacement", () => {
          expect(logMock).toHaveBeenCalled()
        })
      })
    })

    describe("and the `validateTransactions` flag is ture", () => {
      it("calls validTransactionsData()", () => {
        const validTramsactionDataMock = jest.fn()
        blockchain.validTransactionData = validTramsactionDataMock

        newChain.addBlock({ data: "foo" })
        blockchain.replaceChain(newChain.chain, true)
        expect(validTramsactionDataMock).toHaveBeenCalled()
      })
    })
  })

  describe("`isValidChain()", () => {
    beforeEach(() => {
      blockchain.addBlock({ data: "Bears" })
      blockchain.addBlock({ data: "Marshmellow" })
      blockchain.addBlock({ data: "Galactics" })
    })

    describe("when chain doesn't start with genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = {
          ...blockchain.chain[0],
          data: [{ id: "random" }],
        }
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
      })
    })

    describe("when the chain starts with genesis block and has multiple blocks", () => {
      describe("and a `lastHash` reference has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "broken-lastHassh"
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
        })
      })

      describe("and the chain contains a block with an invalid fied", () => {
        it("returns false", () => {
          blockchain.chain[2].data = [{ id: "evil-data" }]
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
        })
      })

      describe("and the chain contains a block with a jumped difficulty", () => {
        it("returns false", () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1]
          const lastHash = lastBlock.hash
          const timestamp = Date.now()
          const nonce = 0
          const data = [{ id: "" }]
          const difficulty = lastBlock.difficulty - 3

          const args = {
            timestamp,
            lastHash,
            nonce,
            difficulty,
            data,
          }
          const hash = hasher(...Object.values(args))
          const badBlock = new Block({ ...args, hash })
          blockchain.chain.push(badBlock)

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
        })
      })

      describe("and the chan doesn't contain any invalid blocks", () => {
        it("returns true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true)
        })
      })
    })
  })

  describe("validTransactionData()", () => {
    let transaction: Transaction, rewardTransaction: Transaction, wallet: Wallet

    beforeEach(() => {
      wallet = new Wallet()
      transaction = wallet.createTransaction({
        recipient: "food-address",
        amount: 65,
      })
      rewardTransaction = Transaction.rewardTransaction({ minerWallet: wallet })
    })

    describe("and the transaction data is valid", () => {
      it("returns true", () => {
        newChain.addBlock({ data: [transaction, rewardTransaction] })
        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          true
        )
        expect(errorMock).not.toHaveBeenCalled()
      })
    })

    describe("and the transaction data has multiple rewards (bad)", () => {
      it("returns false and logs an error", () => {
        newChain.addBlock({
          data: [transaction, rewardTransaction, rewardTransaction],
        })
        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          false
        )
        expect(errorMock).toHaveBeenCalled()
      })
    })

    describe("and the transaction data has at least one malformed outputMap (bad)", () => {
      describe("and the transaction is not a reward transaction", () => {
        it("returns false and logs an error", () => {
          transaction.outputs[wallet.publicKey] = 9999999
          newChain.addBlock({ data: [transaction, rewardTransaction] })
          expect(
            blockchain.validTransactionData({ chain: newChain.chain })
          ).toBe(false)
          expect(errorMock).toHaveBeenCalled()
        })
      })

      describe("and the transaction is a reward transaction", () => {
        it("returns false and logs an error", () => {
          rewardTransaction.outputs[wallet.publicKey] = 9999999
          newChain.addBlock({ data: [transaction, rewardTransaction] })
          expect(
            blockchain.validTransactionData({ chain: newChain.chain })
          ).toBe(false)
          expect(errorMock).toHaveBeenCalled()
        })
      })
    })

    describe("and the transaction data has at least one malformed input (bad)", () => {
      it("returns false and logs an error", () => {
        wallet.balance = 9000

        const evilOutputs = {
          [wallet.publicKey]: 8900,
          FilipRecipientKey: 100,
        }

        const evilTransaction = {
          inputs: {
            timestamp: Date.now(),
            amount: wallet.balance,
            address: wallet.publicKey,
            signature: wallet.sign(evilOutputs),
          },
          outputs: evilOutputs,
        }

        newChain.addBlock({ data: [evilTransaction, rewardTransaction] })
        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          false
        )
        expect(errorMock).toHaveBeenCalled()
      })
    })

    describe("and the transaction contains multiple identical transactions (bad)", () => {
      it("returns false and logs an error", () => {
        newChain.addBlock({
          data: [transaction, transaction, transaction],
        })
        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          false
        )
        expect(errorMock).toHaveBeenCalled()
      })
    })
  })
})
