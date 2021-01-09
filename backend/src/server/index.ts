// # PLUGINS IMPORTS //
import request from "request"
import express from "express"
import bodyParser, { json } from "body-parser"

// # COMPONENTS IMPORTS //
import Blockchain from "../blockchain"
import PubSub from "./pubsub"

// # EXTRA IMPORTS //
const app = express()
app.use(bodyParser.json())

/////////////////////////////////////////////////////////////////////////////

let DEFAULT_PORT = 3000
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`

const blockchain = new Blockchain()
const pubsub = new PubSub({ blockchain })

app.get(`/api/blocks`, (req, res) => {
  res.json(blockchain.chain)
})

app.post("/api/mine", (req, res) => {
  console.log(req.body)
  const { data } = req.body

  blockchain.addBlock({ data })
  pubsub.broadcast()
  res.redirect(`/api/blocks`)
})

const syncChain = () => {
  request(
    { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log("Sync chain")
        blockchain.replaceChain(JSON.parse(body))
      }
    }
  )
}

/////////////////////////////////////////////////////////////////////////////

let PEER_ROOT = DEFAULT_PORT
if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_ROOT = DEFAULT_PORT + Math.ceil(Math.random() * 1000)
}
app.listen(PEER_ROOT, () => {
  console.log(`Listening on localhost localhost:${PEER_ROOT}`)
  syncChain()
})
