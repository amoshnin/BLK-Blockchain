// # PLUGINS IMPORTS //
import express from "express"
import bodyParser from "body-parser"
console.log(process.env)

// # COMPONENTS IMPORTS //
import Blockchain from "../blockchain/blockchain"
import PubSub from "./pubsub"

// # EXTRA IMPORTS //
const app = express()
app.use(bodyParser.json())

/////////////////////////////////////////////////////////////////////////////

const blockchain = new Blockchain()
new PubSub({ blockchain })

app.get(`/api/blocks`, (req, res) => {
  res.json(blockchain.chain)
})

app.post("/api/mine", (req, res) => {
  console.log(req.body)
  const { data } = req.body

  blockchain.addBlock({ data })
  res.redirect(`/api/blocks`)
})

let port = 3000

if (process.env.GENERATE_PEER_PORT === "true") {
  port = port + Math.ceil(Math.random() * 1000)
}

app.listen(port, () => {
  console.log(`Listening on localhost localhost:${port}`)
})
