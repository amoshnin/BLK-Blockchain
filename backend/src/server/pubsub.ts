import PubNub, { MessageEvent } from "pubnub"

const credentials: PubNub.PubnubConfig = {
  publishKey: process.env.PUB_NUB_PUBLISH_KEY,
  subscribeKey: process.env.PUB_NUB_SUBCRIBE_KEY as string,
  secretKey: process.env.PUB_NUB_SECRET_KEY,
}

console.log(process.env)

const CHANNELS = {
  TEST: "TEST",
}

class PubSub {
  pubnub: PubNub

  constructor() {
    this.pubnub = new PubNub(credentials)
    this.pubnub.subscribe({ channels: Object.values(CHANNELS) })
    this.pubnub.addListener(this.listener())
  }

  listener() {
    return {
      message: ({ channel, message }: MessageEvent) => {
        console.log(
          `Message recieved. Channel: ${channel}. Message: ${message}`
        )
      },
    }
  }
}
