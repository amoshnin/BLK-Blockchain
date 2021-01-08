"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_hash_1 = __importDefault(require("../src/utils/crypto-hash"));
describe("cryptoHash() Test", function () {
    var input = {
        input: "foo",
        output: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
    };
    it("generates a SHA-256 hashed output", function () {
        expect(crypto_hash_1.default(input.input)).toEqual(input.output);
    });
    it("produces same hash with same input arguments in any order", function () {
        var nm = ["one", "two", "three"];
        expect(crypto_hash_1.default(nm[2], nm[1], nm[0])).toEqual(crypto_hash_1.default(nm[0], nm[2], nm[1]));
    });
});
