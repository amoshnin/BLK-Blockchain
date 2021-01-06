"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Block = /** @class */ (function () {
    function Block(props) {
        this.props = props;
    }
    return Block;
}());
exports.default = Block;
var block1 = new Block({
    timestamp: Date.now(),
    lastHash: "dsa",
    hash: "dsadsa",
    data: { ds: "dsa" },
});
console.log(block1);
