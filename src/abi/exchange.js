const abi = [{
    type: 'function',
    name: 'swapExact',
    inputs: [
        { name: 'amountIn', type: 'uint256' },
        { name: 'amountOutMin', type: 'uint256' },
        { name: 'path', type: 'address[]' },
        { name: 'router', type: 'address' },
        { name: 'deadline', type: 'uint256' },
    ]
}, {
    type: 'function',
    name: 'swapAll',
    inputs: [
        { name: 'amountOutMin', type: 'uint256' },
        { name: 'path', type: 'address[]' },
        { name: 'router', type: 'address' },
        { name: 'deadline', type: 'uint256' },
    ]
}];

module.exports = abi;