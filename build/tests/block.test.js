"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var block_1 = __importDefault(require("../src/block"));
// @ts-ignore
var hex_to_binary_1 = __importDefault(require("hex-to-binary"));
var config_1 = require("../src/config");
describe("BlockTest", function () {
    var _a = {
        timestamp: 2000,
        lastHash: "foo-hash",
        hash: "bar-hash",
        data: "data boilter",
        nonce: 1,
        difficulty: 4,
    }, timestamp = _a.timestamp, lastHash = _a.lastHash, hash = _a.hash, data = _a.data, nonce = _a.nonce, difficulty = _a.difficulty;
    var block = new block_1.default({
        timestamp: timestamp,
        lastHash: lastHash,
        hash: hash,
        data: data,
        nonce: nonce,
        difficulty: difficulty,
    });
    describe("adjustDifficulty", function () {
        it("raises difficulty for quickly mined block", function () {
            expect(block_1.default.adjustDifficulty({
                originalBlock: block,
                timestamp: block.timestamp + config_1.MINE_RATE - 100,
            })).toEqual(block.difficulty + 1);
        });
        it("lowers difficulty for slowly mined block", function () {
            expect(block_1.default.adjustDifficulty({
                originalBlock: block,
                timestamp: block.timestamp + config_1.MINE_RATE + 100,
            })).toEqual(block.difficulty - 1);
        });
    });
    describe("genesis()", function () {
        var genesisBlock = block_1.default.genesis();
        it("returns a Block instance", function () {
            expect(genesisBlock instanceof block_1.default).toBe(true);
        });
        it("returns the genesis data", function () {
            expect(genesisBlock).toEqual(config_1.GENESIS_DATA);
        });
    });
    describe("mineBlock()", function () {
        var data = "mined data";
        var lastBlock = block_1.default.genesis();
        var minedBlock = block_1.default.mineBlock({ lastBlock: lastBlock, data: data });
        it("returns a Block instance", function () {
            expect(minedBlock instanceof block_1.default).toBe(true);
        });
        it("sets the `lastHash` to be the `hash` of the last block", function () {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });
        it("sets the `data`", function () {
            expect(minedBlock.data).toEqual(data);
        });
        it("sets a timestamp", function () {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });
        it("creates a SHA-256 `hash` based on proper inputs", function () { });
        it("sets a `hash` that matches the difficulty criteria", function () {
            console.log(hex_to_binary_1.default(minedBlock.hash));
            expect(hex_to_binary_1.default(minedBlock.hash).substring(0, minedBlock.difficulty)).toEqual("0".repeat(minedBlock.difficulty));
        });
        it("adjusts the difficulty", function () {
            var possibleResults = [
                lastBlock.difficulty + 1,
                lastBlock.difficulty - 1,
            ];
            expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
        });
        it("has a lower limit of 1", function () {
            block.difficulty = -1;
            expect(block_1.default.adjustDifficulty({ originalBlock: block, timestamp: Date.now() })).toEqual(1);
        });
    });
});
