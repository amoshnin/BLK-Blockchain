// # PLUGINS IMPORTS //
import PubNub, { MessageEvent } from "pubnub"
import dotenv from "dotenv"

// # COMPONENTS IMPORTS //
import Blockchain from "../blockchain/blockchain"

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
}

export default class PubSub {
  pubnub: PubNub
  blockchain: Blockchain

  constructor({ blockchain }: { blockchain: Blockchain }) {
    this.blockchain = blockchain

    this.pubnub = new PubNub(credentials)
    this.pubnub.subscribe({ channels: Object.values(CHANNELS) })
    this.pubnub.addListener(this.listener())

    setTimeout(() => {
      this.broadcast()
    }, 1000)
  }

  listener() {
    return {
      message: ({ channel, message }: MessageEvent) => {
        console.log(
          `Message recieved. Channel: ${channel}. Chain length: ${message.length}`
        )
        if (channel === CHANNELS.BLOCKCHAIN) {
          this.blockchain.replaceChain(message)
        }
      },
    }
  }

  broadcast() {
    this._publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: this.blockchain.chain,
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
