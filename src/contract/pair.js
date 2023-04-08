const abi = require('../abi');
const Contract = require('./contract');

class Pair extends Contract {
    constructor(web3, address) {
        super(web3, address, abi.pair);
    }

    async getReserves() {
        const reserves = await this.data.methods.getReserves().call();

        return [
            BigInt(reserves['_reserve0']),
            BigInt(reserves['_reserve1'])
        ];
    }
}

module.exports = Pair;