"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var crypto_hash_1 = __importDefault(require("./utils/crypto-hash"));
// @ts-ignore
var hex_to_binary_1 = __importDefault(require("hex-to-binary"));
var Block = /** @class */ (function () {
    function Block(_a) {
        var data = _a.data, hash = _a.hash, lastHash = _a.lastHash, timestamp = _a.timestamp, difficulty = _a.difficulty, nonce = _a.nonce;
        this.data = "";
        this.hash = "";
        this.lastHash = "";
        this.timestamp = 0;
        this.difficulty = 0;
        this.nonce = 0;
        this.data = data;
        this.hash = hash;
        this.lastHash = lastHash;
        this.timestamp = timestamp;
        this.difficulty = difficulty;
        this.nonce = nonce;
    }
    Block.genesis = function () {
        return new this(config_1.GENESIS_DATA);
    };
    Block.mineBlock = function (_a) {
        var lastBlock = _a.lastBlock, data = _a.data;
        var lastBlockHash = lastBlock.hash, lastBlockDifficulty = lastBlock.difficulty;
        var difficulty = lastBlockDifficulty;
        var hash, timestamp, nonce = 0;
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({
                originalBlock: lastBlock,
                timestamp: timestamp,
            });
            hash = crypto_hash_1.default(data, timestamp, lastBlockHash, nonce, difficulty);
        } while (hex_to_binary_1.default(hash).substring(0, difficulty) !== "0".repeat(difficulty));
        return new this({
            data: data,
            timestamp: timestamp,
            difficulty: difficulty,
            nonce: nonce,
            hash: hash,
            lastHash: lastBlockHash,
        });
    };
    Block.adjustDifficulty = function (_a) {
        var originalBlock = _a.originalBlock, timestamp = _a.timestamp;
        var difficulty = originalBlock.difficulty;
        if (difficulty < 1)
            return 1;
        if (timestamp - originalBlock.timestamp > config_1.MINE_RATE) {
            return difficulty - 1;
        }
        else {
            return difficulty + 1;
        }
    };
    return Block;
}());
exports.default = Block;
