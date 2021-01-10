import { IBlockData } from "../blockchain/block"
import Transaction from "./transaction"

export interface ITransactionsMap {
  [key: string]: Transaction
}

export default class TransactionPool {
  transactionsMap: ITransactionsMap = {}

  setTransaction(transaction: Transaction) {
    this.transactionsMap[transaction.id] = transaction
  }

  setMap({ transactionsMap }: { transactionsMap: ITransactionsMap }) {
    this.transactionsMap = transactionsMap
  }

  clear() {
    this.transactionsMap = {}
  }

  clearBlockchainTransactions({ chain }: { chain: Array<IBlockData> }) {
    chain.forEach((block) => {
      for (let transaction of block.data) {
        if (this.transactionsMap[transaction.id]) {
          delete this.transactionsMap[transaction.id]
        }
      }
    })
  }

  existingTransaction({ inputAddress }: { inputAddress: string }) {
    console.log(this.transactionsMap, "incomeomeo")
    const transactions = Object.values(this.transactionsMap)
    return transactions.find(
      (transactions) => transactions.inputs.address === inputAddress
    )
  }
}
