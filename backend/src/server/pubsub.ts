// # PLUGINS IMPORTS //
import PubNub, { MessageEvent } from "pubnub"
import dotenv from "dotenv"

// # COMPONENTS IMPORTS //
import Blockchain from "../ledger/blockchain/blockchain"
import TransactionPool from "../ledger/wallet/transaction-pool"
import Transaction from "../ledger/wallet/transaction"

// # EXTRA IMPORTS //
dotenv.config({})

/////////////////////////////////////////////////////////////////////////////

const credentials: PubNub.PubnubConfig = {
  publishKey: process.env.PUB_NUB_PUBLISH_KEY,
  subscribeKey: process.env.PUB_NUB_SUBCRIBE_KEY as string,
  secretKey: process.env.PUB_NUB_SECRET_KEY,
}

const CHANNELS = {
  BLOCKCHAIN: "BLOCKCHAIN",
  TRANSACTION: "TRANSACTION",
}

interface IProps {
  blockchain: Blockchain
  transactionPool: TransactionPool
}

export default class PubSub {
  pubnub: PubNub
  blockchain: Blockchain
  transactionPool: TransactionPool

  constructor({ blockchain, transactionPool }: IProps) {
    this.blockchain = blockchain
    this.transactionPool = transactionPool

    this.pubnub = new PubNub(credentials)
    this.pubnub.subscribe({ channels: Object.values(CHANNELS) })
    this.pubnub.addListener(this.listener())

    setTimeout(() => {
      this.broadcastBlockchain()
    }, 1000)
  }

  listener() {
    return {
      message: ({ channel, message }: MessageEvent) => {
        console.log(
          `Message recieved. Channel: ${channel}. Chain length: ${message.length}`
        )

        switch (channel) {
          case CHANNELS.BLOCKCHAIN:
            this.blockchain.replaceChain(message)
            break

          case CHANNELS.TRANSACTION:
            this.transactionPool.setTransaction(message)
            break

          default:
            return
        }
      },
    }
  }

  broadcastBlockchain() {
    this._publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: this.blockchain.chain,
    })
  }

  broadcastTransaction(transaction: Transaction) {
    this._publish({
      channel: CHANNELS.TRANSACTION,
      message: transaction,
    })
  }

  private _publish({
    channel,
    message,
  }: {
    channel: MessageEvent["channel"]
    message: MessageEvent["message"]
  }) {
    this.pubnub.publish({ channel, message })
  }
}
