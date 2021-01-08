"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
function cryptoHash() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    var hash = crypto_1.default.createHash("sha256");
    hash.update(inputs.sort().join(" "));
    return hash.digest("hex");
}
exports.default = cryptoHash;
