class Contract {
    constructor(web3, address, abi) {
        this.data = new web3.eth.Contract(abi, address);
        this.address = address;
        this.eth = web3.eth;
    }
}

module.exports = Contract;