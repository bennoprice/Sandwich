const getWallet = eth => (
    eth.accounts.wallet[0].address
);

const getCurrentTime = () => (
    Math.floor(Date.now() / 1000)
);

const timeout = ms => (
    new Promise(res => setTimeout(res, ms))
);

module.exports = {
    timeout,
    getWallet,
    getCurrentTime
};