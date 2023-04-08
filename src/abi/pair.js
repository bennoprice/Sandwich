const abi = [{
    type: 'function',
    name: 'getReserves',
    inputs: [],
    outputs: [
        { name: '_reserve0', type: 'uint112' },
        { name: '_reserve1', type: 'uint112' },
        { name: '_blockTimestampLast', type: 'uint32' }
    ],
    constant: true
}];

module.exports = abi;