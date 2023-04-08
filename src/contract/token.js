const abi = require('../abi');
const Contract = require('./contract');

class Token extends Contract {
    constructor(web3, address) {
        super(web3, address, abi.token);
    }

    async getBalance(address) {
        const balance = await this.data.methods.balanceOf(address).call();
        return BigInt(balance);
    }
}

module.exports = Token;