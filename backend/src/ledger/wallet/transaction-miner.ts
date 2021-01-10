import PubSub from "../../server/pubsub"
import Blockchain from "../blockchain/blockchain"
import TransactionPool from "./transaction-pool"
import Wallet from "./wallet"

interface IProps {
  blockchain: Blockchain
  transactionPool: TransactionPool
  wallet: Wallet
  pubsub: PubSub
}

export default class TransactionMiner {
  blockchain: Blockchain
  transactionPool: TransactionPool
  wallet: Wallet
  pubsub: PubSub

  constructor({ blockchain, transactionPool, wallet, pubsub }: IProps) {
    this.blockchain = blockchain
    this.transactionPool = transactionPool
    this.wallet = wallet
    this.pubsub = pubsub
  }

  mineTransaction() {
    // 1) get the transaction pool's valid transactions
    // 2) generate the miner's reward
    // 3) add a block consisting of these transactions to the blockchain
    // 4) broadcast the updated blockchain
    // 5) clear the pool
  }
}
