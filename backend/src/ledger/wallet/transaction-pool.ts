import Transaction from "./transaction"

interface ITransactionsMap {
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

  existingTransaction({ inputAddress }: { inputAddress: string }) {
    console.log(this.transactionsMap, "incomeomeo")
    const transactions = Object.values(this.transactionsMap)
    return transactions.find(
      (transactions) => transactions.inputs.address === inputAddress
    )
  }
}
