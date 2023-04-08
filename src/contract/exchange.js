const abi = require('../abi');
const util = require('../util');
const Contract = require('./contract');

class Exchange extends Contract {
    constructor(web3, address, router) {
        super(web3, address, abi.exchange);
        this.router = router;
    }

    async swapExact(amountIn, amountOutMin, path, gas, offset = 0) {
        const wallet = util.getWallet(this.eth);
        const deadline = util.getCurrentTime() + 120;
        const nonce = await this.eth.getTransactionCount(wallet);

        return await this.data.methods.swapExact(
            amountIn,
            amountOutMin,
            path,
            this.router.address,
            deadline
        )
        .send({
            from: wallet,
            gasPrice: gas,
            gas: 250000,
            nonce: nonce + offset
        });
    }

    async swapAll(amountOutMin, path, gas, offset = 0) {
        const wallet = util.getWallet(this.eth);
        const deadline = util.getCurrentTime() + 120;
        const nonce = await this.eth.getTransactionCount(wallet);

        return await this.data.methods.swapAll(
            amountOutMin,
            path,
            this.router.address,
            deadline
        )
        .send({
            from: wallet,
            gasPrice: gas,
            gas: 250000,
            nonce: nonce + offset
        });
    }
}

module.exports = Exchange;