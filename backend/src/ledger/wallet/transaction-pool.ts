import Transaction from "./transaction"

export default class TransactionPool {
  transactionsMap: { [key: string]: Transaction } = {}

  setTransaction(transaction: Transaction) {
    this.transactionsMap[transaction.id] = transaction
  }

  existingTransaction({ inputAddress }: { inputAddress: string }) {
    const transactions = Object.values(this.transactionsMap)
    return transactions.find(
      (transactions) => transactions.inputs.address === inputAddress
    )
  }
}
