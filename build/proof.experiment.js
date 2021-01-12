"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var blockchain_1 = __importDefault(require("./blockchain"));
var blockchain = new blockchain_1.default();
blockchain.addBlock({ data: "INITIAL" });
console.log("first block", blockchain.chain[blockchain.chain.length - 1]);
var prevTimestamp, nextTimstamp, nextBlock, timeDiff, average;
var times = [];
for (var i = 0; i < 10000; i++) {
    prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;
    blockchain.addBlock({ data: "block " + i });
    nextBlock = blockchain.chain[blockchain.chain.length - 1];
    nextTimstamp = nextBlock.timestamp;
    timeDiff = nextTimstamp - prevTimestamp;
    times.push(timeDiff);
    average = times.reduce(function (acc, cur) { return acc + cur; }) / times.length;
    console.log("Time to mine block: " + timeDiff + "ms. Difficulty: " + nextBlock.difficulty + ". Average time: " + average + "ms");
}
