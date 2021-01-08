import express from "express"
import Blockchain from "../blockchain/blockchain"

const app = express()
const blockchain = new Blockchain()

app.get(`/api/blocks`, (req, res) => {
  res.json(blockchain.chain)
})

const port = 3000
app.listen(port, () => {
  console.log(`Listening on localhost localhost:${port}`)
})
