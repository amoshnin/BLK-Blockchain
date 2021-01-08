"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var blockchain_1 = __importDefault(require("../src/blockchain"));
var block_1 = __importDefault(require("../src/block"));
describe("Blockchain Test", function () {
    var blockchain = new blockchain_1.default();
    var newChain = new blockchain_1.default();
    var originalChain;
    beforeEach(function () {
        blockchain = new blockchain_1.default();
        newChain = new blockchain_1.default();
        originalChain = blockchain.chain;
    });
    it("should contain a `chain` Array instance", function () {
        expect(blockchain.chain instanceof Array).toBe(true);
    });
    it("start with the genesis block", function () {
        expect(blockchain.chain[0]).toEqual(block_1.default.genesis());
    });
    it("adds a new block to chain", function () {
        var newData = "foo bar";
        blockchain.addBlock({ data: newData });
        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
    });
    describe("replaceChain()", function () {
        var errorMock, logMock;
        beforeEach(function () {
            errorMock = jest.fn();
            logMock = jest.fn();
            global.console.error = errorMock;
            global.console.log = logMock;
        });
        describe("when the new chain is not longer", function () {
            beforeEach(function () {
                newChain.chain[0] = { new: "chain" };
                blockchain.replaceChain(newChain.chain);
            });
            it("doesn't replace the chain", function () {
                expect(blockchain.chain).toEqual(originalChain);
            });
            it("logs an error", function () {
                expect(errorMock).toHaveBeenCalled();
            });
        });
        describe("when the new chain is longer", function () {
            beforeEach(function () {
                newChain.addBlock({ data: "Bears" });
                newChain.addBlock({ data: "Marshmellow" });
                newChain.addBlock({ data: "Galactics" });
            });
            describe("and the chain is invalid", function () {
                beforeEach(function () {
                    newChain.chain[2].hash = "fake-hash";
                    blockchain.replaceChain(newChain.chain);
                });
                it("doesn't replace the chain", function () {
                    expect(blockchain.chain).toEqual(originalChain);
                });
                it("logs an error", function () {
                    expect(errorMock).toHaveBeenCalled();
                });
            });
            describe("and the chain is valid", function () {
                beforeEach(function () { return blockchain.replaceChain(newChain.chain); });
                it("replaces the chain", function () {
                    expect(blockchain.chain).toEqual(newChain.chain);
                });
                it("logs anout the chain replacement", function () {
                    expect(logMock).toHaveBeenCalled();
                });
            });
        });
    });
    describe("`isValidChain()", function () {
        beforeEach(function () {
            blockchain.addBlock({ data: "Bears" });
            blockchain.addBlock({ data: "Marshmellow" });
            blockchain.addBlock({ data: "Galactics" });
        });
        describe("when chain doesn't start with genesis block", function () {
            it("returns false", function () {
                blockchain.chain[0] = __assign(__assign({}, blockchain.chain[0]), { data: "fake-genesis" });
                expect(blockchain_1.default.isValidChain(blockchain.chain)).toBe(false);
            });
        });
        describe("when the chain starts with genesis block and has multiple blocks", function () {
            describe("and a `lastHash` reference has changed", function () {
                it("returns false", function () {
                    blockchain.chain[2].lastHash = "broken-lastHassh";
                    expect(blockchain_1.default.isValidChain(blockchain.chain)).toBe(false);
                });
            });
            describe("and the chain contains a block with an invalid fied", function () {
                it("returns false", function () {
                    blockchain.chain[2].data = "some-bad-and-evil-data";
                    expect(blockchain_1.default.isValidChain(blockchain.chain)).toBe(false);
                });
            });
            describe("and the chan doesn't contain any invalid blocks", function () {
                it("returns true", function () {
                    expect(blockchain_1.default.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });
});
