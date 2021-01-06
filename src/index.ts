import Block from "./block"

const block1 = new Block({
  timestamp: Date.now(),
  lastHash: "dsa",
  hash: "dsadsa",
  data: { ds: "dsa" },
})

console.log(block1)
