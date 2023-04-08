const abi = [{
    type: 'function',
    name: 'swapExactETHForTokens',
    inputs: [
        { name: 'amountOutMin', type: 'uint256' },
        { name: 'path', type: 'address[]' },
        { name: 'to', type: 'address' },
        { name: 'deadline', type: 'uint256' },
    ],
    outputs: [
        { name: 'amounts', type: 'uint256[]' }
    ]
}, {
    type: 'function',
    name: 'swapETHForExactTokens',
    inputs: [
        { name: 'amountOut', type: 'uint256' },
        { name: 'path', type: 'address[]' },
        { name: 'to', type: 'address' },
        { name: 'deadline', type: 'uint256' },
    ],
    outputs: [
        { name: 'amounts', type: 'uint256[]' }
    ]
}, {
    type: 'function',
    name: 'swapExactTokensForTokens',
    inputs: [
        { name: 'amountIn', type: 'uint256' },
        { name: 'amountOutMin', type: 'uint256' },
        { name: 'path', type: 'address[]' },
        { name: 'to', type: 'address' },
        { name: 'deadline', type: 'uint256' },
    ],
    outputs: [
        { name: 'amounts', type: 'uint256[]' }
    ]
}, {
    type: 'function',
    name: 'swapTokensForExactTokens',
    inputs: [
        { name: 'amountOut', type: 'uint256' },
        { name: 'amountInMax', type: 'uint256' },
        { name: 'path', type: 'address[]' },
        { name: 'to', type: 'address' },
        { name: 'deadline', type: 'uint256' },
    ],
    outputs: [
        { name: 'amounts', type: 'uint256[]' }
    ]
}, {
    type: 'function',
    name: 'getAmountIn',
    inputs: [
        { name: 'amountOut', type: 'uint256' },
        { name: 'reserveIn', type: 'uint256' },
        { name: 'reserveOut', type: 'uint256' },
        { name: 'fee', type: 'uint256' }
    ],
    outputs: [
        { name: 'amountIn', type: 'uint256' }
    ],
    constant: true
}, {
    type: 'function',
    name: 'getAmountOut',
    inputs: [
        { name: 'amountIn', type: 'uint256' },
        { name: 'reserveIn', type: 'uint256' },
        { name: 'reserveOut', type: 'uint256' },
        { name: 'fee', type: 'uint256' }
    ],
    outputs: [
        { name: 'amountOut', type: 'uint256' }
    ],
    constant: true
}, {
    type: 'function',
    name: 'getAmountsOut',
    inputs: [
        { name: 'amountIn', type: 'uint256' },
        { name: 'path', type: 'address[]' },
        { name: 'fee', type: 'uint256' }
    ],
    outputs: [
        { name: 'amounts', type: 'uint256[]' }
    ],
    constant: true
}];

module.exports = abi;