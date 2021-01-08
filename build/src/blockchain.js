"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var block_1 = __importDefault(require("./block"));
var crypto_hash_1 = __importDefault(require("./utils/crypto-hash"));
var Blockchain = /** @class */ (function () {
    function Blockchain() {
        this.chain = [block_1.default.genesis()];
    }
    Blockchain.isValidChain = function (chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(block_1.default.genesis())) {
            return false;
        }
        for (var i = 1; i < chain.length; i++) {
            var _a = chain[i], hash = _a.hash, rest = __rest(_a, ["hash"]);
            var prevBlockHash = chain[i - 1].hash;
            if (prevBlockHash !== rest.lastHash)
                return false;
            var validatedHash = crypto_hash_1.default.apply(void 0, Object.values(rest));
            if (hash !== validatedHash)
                return false;
        }
        return true;
    };
    Blockchain.prototype.replaceChain = function (chain) {
        if (chain.length <= this.chain.length) {
            console.error("Incoming chain must be longer");
            return;
        }
        if (!Blockchain.isValidChain(chain)) {
            console.error("The chain income must be valid");
            return;
        }
        console.log("Replacing chain with", chain);
        this.chain = chain;
    };
    Blockchain.prototype.addBlock = function (_a) {
        var data = _a.data;
        var newBlock = block_1.default.mineBlock({
            data: data,
            lastBlock: this.chain[this.chain.length - 1],
        });
        this.chain.push(newBlock);
    };
    return Blockchain;
}());
exports.default = Blockchain;
