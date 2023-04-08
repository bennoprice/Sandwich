const abi = require('../abi');
const Contract = require('./contract');

class Router extends Contract {
    constructor(web3, address) {
        super(web3, address, abi.router);
        this.fee = 25n;
    }

    async getAmountIn(amountOut, reserves) {
        const amountIn = await this.data.methods.getAmountIn(
            amountOut,
            reserves[0],
            reserves[1],
            this.fee
        ).call();

        return BigInt(amountIn);
    }

    async getAmountOut(amountIn, reserves) {
        const amountOut = await this.data.methods.getAmountOut(
            amountIn,
            reserves[0],
            reserves[1],
            this.fee
        ).call();

        return BigInt(amountOut);
    }

    async getAmountsOut(amountIn, path) {
        const amounts = await this.data.methods.getAmountsOut(
            amountIn,
            path,
            this.fee
        ).call();
        
        return BigInt(amounts[amounts.length - 1]);
    }
}

module.exports = Router;