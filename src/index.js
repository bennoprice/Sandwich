const Web3 = require('web3');
const Web3WsProvider = require('web3-providers-ws');
const abiDecoder = require('abi-decoder');
const contract = require('./contract');
const sqrt = require('bigint-isqrt');
const config = require('./config');
const util = require('./util');
const abi = require('./abi');

const options = {
    reconnect: {
        auto: true
    }
};

const ws = new Web3WsProvider(config.node, options);
const web3 = new Web3(ws);

web3.eth.accounts.wallet.add(config.wallet);
abiDecoder.addABI(abi.router);

const token = Object.fromEntries(
    Object.entries(config.token).map(
        ([key, value]) => [key, new contract.Token(web3, value)]
    )
);

const router = new contract.Router(web3, config.router);
const exchange = new contract.Exchange(web3, config.exchange, router);
const pair = new contract.Pair(web3, config.pair);

let busy = false;
let failed = 0;

// todo: check nonce
const isTxValid = async (tx, params) => {
    if (tx.gas < 100000) {
        console.log('invalid gas limit', tx.hash);
        return false;
    }

    if (tx.gasPrice < 1 * (10 ** 9)) {
        console.log('invalid gas price', tx.hash);
        return false;
    }

    if (params.deadline - util.getCurrentTime() < 90) {
        console.log('invalid deadline', tx.hash);
        return false;
    }

    try {
        await web3.eth.estimateGas({
            from: tx.from,
            data: tx.input,
            to: tx.to,
            value: tx.value
        });

        return true;
    }
    catch (err) {
        console.log(err.message, tx.hash);
        return false;
    }
};

const getAmounts = async (params, value) => {
    const amounts = [
        params.amountIn || params.amountInMax || value,
        params.amountOutMin || params.amountOut
    ];

    if (params.path.length === 2)
        return [
            BigInt(amounts[0]),
            BigInt(amounts[1])
        ];

    const path = params.path.slice(0, -1);
    const amount0 = await router.getAmountsOut(amounts[0], path);

    return [
        BigInt(amount0),
        BigInt(amounts[1])
    ];
};

const calculateAmountInMax = (amounts, reserves, tolerance) => {
    const amountsWithFee = [
        amounts[0] * (10000n - router.fee - tolerance) / 10000n,
        amounts[1]
    ];

    const k = reserves[0] * reserves[1];

    const a = amountsWithFee[1];
    const b = amountsWithFee[1] * amountsWithFee[0];
    const c = -(k * amountsWithFee[0]);

    const x = (-b + sqrt(b * b - 4n * a * c)) / (2n * a);

    return x - reserves[0];
};

const updateReserves = (amounts, reserves) => {
    reserves[0] += amounts[0];
    reserves[1] -= amounts[1];
};

const calculateGasPrice = (tx) => {
    const gasPrice = parseInt(tx.maxPriorityFeePerGas);

    return (tx.type === 0) ?
        gasPrice :
        gasPrice + 1 * (10 ** 9);
}

const frontrun = async (amountIn, tx) => {
    const gasPrice = calculateGasPrice(tx);
    
    {
        const path = [config.token.frax, config.token.rome];
        const amountOut = await router.getAmountsOut(amountIn, path);
        const amountOutMin = amountOut * 995n / 1000n; // 0.5%

        const raisedGasPrice = gasPrice + 200 * (10 ** 7);

        exchange.swapExact(amountIn, amountOutMin, path, raisedGasPrice, 0);
    }

    await util.timeout(10000);

    {
        const path = [config.token.rome, config.token.frax];

        try {
            const reducedGasPrice = gasPrice - 100 * (10 ** 7);
            await exchange.swapAll(amountIn, path, reducedGasPrice, 1);
        }
        catch (err) {
            const raisedGasPrice = 20 * (10 ** 9);
            const amountOutMin = amountIn * 97n / 100n; // 3% (includes fee)
            await exchange.swapAll(amountOutMin, path, raisedGasPrice, 0);
        }
    }
};

web3.eth.subscribe('pendingTransactions', async (err, txh) => {
    if (err)
        return console.error(err);

    if (failed >= 2)
        return;

    if (busy)
        return;

    const tx = await web3.eth.getTransaction(txh);

    if (!tx)
        return;

    if (tx.from === util.getWallet(web3.eth))
        return;

    if (tx.to?.toLowerCase() !== config.router)
        return;

    const decoded = abiDecoder.decodeMethod(tx.input);

    if (!decoded)
        return;

    const method = decoded.name;

    const params = Object.fromEntries(
        decoded.params.map(x => [x.name, x.value]
    ));

    const tokens = params.path.slice(-2);

    if (tokens[0] !== config.token.frax || tokens[1] !== config.token.rome)
        return;

    const valid = await isTxValid(tx, params);

    if (!valid)
        return;

    const amounts = await getAmounts(params, tx.value);
    const reserves = await pair.getReserves();

    console.log(txh);
    //console.log('gas', tx.gasPrice, tx.maxFeePerGas, tx.maxPriorityFeePerGas);
    console.log('reserves', reserves);
    console.log('amounts', parseInt(amounts[0]) / (10 ** 18), parseInt(amounts[1]) / (10 ** 9));

    const amountInMax = calculateAmountInMax(amounts, reserves, 6n);

    if (amountInMax <= 0n)
        return;

    const balance = await token.frax.getBalance(util.getWallet(web3.eth));

    /*if (balance <= 9850n * (10n ** 18n))
        return;*/

    const amountIn = amountInMax > balance ? balance : amountInMax;
    const amountOut = await router.getAmountOut(amountIn, reserves);

    updateReserves([amountIn, amountOut], reserves);

    switch (method) {
        case 'swapExactTokensForTokens':
        case 'swapExactETHForTokens':
            amounts[1] = await router.getAmountOut(amounts[0], reserves);
            break;
        case 'swapTokensForExactTokens':
        case 'swapETHForExactTokens':
            amounts[0] = await router.getAmountIn(amounts[1], reserves);
    }

    updateReserves(amounts, reserves);

    const amountInNew = await router.getAmountOut(amountOut, [...reserves].reverse());

    const profit = amountInNew - amountIn;

    console.log('amountInMax', parseInt(amountInMax) / (10 ** 18));
    console.log('amountIn', parseInt(amountIn) / (10 ** 18));
    console.log('amounts', parseInt(amounts[0]) / (10 ** 18), parseInt(amounts[1]) / (10 ** 9));
    console.log('profit', parseInt(profit) / (10 ** 18));
    console.log();


    if (profit < 7n * (10n ** 18n))
        return;

    if (profit < 14n * (10n ** 18n) && amountIn > 4500n * (10n ** 18n))
        return;

    console.log('frontrunning');

    busy = true;
    await frontrun(amountIn, tx);
    busy = false;

    const balanceNew = await token.frax.getBalance(util.getWallet(web3.eth));
    const actualProfit = balanceNew - balance;

    if (actualProfit <= 0n)
        ++failed;

    console.log('profit', parseInt(actualProfit) / (10 ** 18));
    console.log();
});