// # PLUGINS IMPORTS //
import request from "request"
import express from "express"
import bodyParser from "body-parser"

// # COMPONENTS IMPORTS //
import Blockchain from "../ledger/blockchain/blockchain"
import TransactionPool from "../ledger/wallet/transaction-pool"
import Wallet from "../ledger/wallet/wallet"
import PubSub from "./pubsub"
import { routes } from "./config/routes"
import TransactionMiner from "../ledger/wallet/transaction-miner"

// # EXTRA IMPORTS //
const app = express()
app.use(bodyParser.json())

/////////////////////////////////////////////////////////////////////////////

let DEFAULT_PORT = 3000
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`

const blockchain = new Blockchain()
const transactionPool = new TransactionPool()
const wallet = new Wallet()
const pubsub = new PubSub({ blockchain, transactionPool, wallet })
const transactionMiner = new TransactionMiner({
  blockchain,
  transactionPool,
  wallet,
  pubsub,
})

/////////////////////////////////////////////////////////////////////////////

app.get(routes.blocks, (req, res) => {
  res.json(blockchain.chain)
})

app.post(routes.mine, (req, res) => {
  console.log(req.body)
  const { data } = req.body

  blockchain.addBlock({ data })
  pubsub.broadcastBlockchain()
  res.redirect(routes.blocks)
})

app.post(routes.transact, (req, res) => {
  const { amount, recipient } = req.body
  let transaction = transactionPool.existingTransaction({
    inputAddress: wallet.publicKey,
  })

  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount })
    } else {
      transaction = wallet.createTransaction({ recipient, amount })
    }
  } catch (error) {
    return res.status(400).json({ type: "error", message: error.message })
  }

  transactionPool.setTransaction(transaction)
  pubsub.broadcastTransaction(transaction)
  res.json({ type: "success", transaction })
})

app.get(routes.transactionPoolMap, (req, res) => {
  res.json(transactionPool.transactionsMap)
})

app.get(routes.mineTransactions, (req, res) => {
  transactionMiner.mineTransaction()
  res.redirect(routes.blocks)
})

const syncWithRootState = () => {
  request(
    { url: `${ROOT_NODE_ADDRESS}${routes.blocks}` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        console.log("Sync chain")
        blockchain.replaceChain(JSON.parse(body))
      }
    }
  )

  request(
    { url: `${ROOT_NODE_ADDRESS}${routes.transactionPoolMap}` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const transactionsMap = body ? JSON.parse(body) : {}
        console.log("Replacing Transaction root map", transactionsMap)
        transactionPool.setMap({ transactionsMap })
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
  syncWithRootState()
})
