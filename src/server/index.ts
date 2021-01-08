import express from "express"
import bodyParser from "body-parser"
import Blockchain from "../blockchain/blockchain"

const app = express()
app.use(bodyParser.json())
const blockchain = new Blockchain()

app.get(`/api/blocks`, (req, res) => {
  res.json(blockchain.chain)
})

app.post("/api/mine", (req, res) => {
  console.log(req.body)
  const { data } = req.body

  const result = blockchain.addBlock({ data })
  res.redirect(`/api/blocks`)
})

const port = 3000
app.listen(port, () => {
  console.log(`Listening on localhost localhost:${port}`)
})
