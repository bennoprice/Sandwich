# Sandwich Bot
Sandwich bot targetting $ROME on Moonriver.  
Developed over a year ago and made around $30,000 profit.

As is, the bot is not profitable in the extremely competitive MEV environment, but is meant as a learning resource.  
Whilst the bot doesn't have any of the crazy optimisations production bots have, it captures the essence of sandwich trading whilst remaining simple and easily digestable.

Logic of particular interest is the formula for determining the maximum amount to buy with whilst respecting the targets slippage tolerance.  
As an aside, I discovered an inconsistency in the way moonriver reported its pending transactions, hence the quirk in calculateGasPrice.  
I later confirmed this with a developer.

![Developer](https://i.gyazo.com/f264109539f07ff10ab78eafcec15ebd.png)
