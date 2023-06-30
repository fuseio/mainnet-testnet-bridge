task("setTrustedRemote", "sets trusted remotes for OFT and NativeOFT", require("./setTrustedRemote"))
  .addParam("targetNetwork", "the destination chainId")

task("bridge", "bridges native tokens", require("./bridge"))
  .addParam("targetNetwork", "the destination chainId")
  .addParam("amount", "amount to bridge")

task("calculateTokenRatio", "calculate the token ratio between two tokens", require("./calculateTokenRatio"))
  .addParam("ethAmount", "ETH amount to add")
  .addParam("targetNetwork", "the name destination chain")

task("tokenArbitrageAmount", "calculate the token ratio between two tokens", require("./tokenArbitrageAmount"))
  .addParam("targetNetwork", "the name destination chain")
  .addOptionalParam("swap")

task("addLiquidity", "adds Liquidity", require("./addLiquidity"))
  .addParam("targetNetwork", "the name destination chain")
  .addParam("ethAmount", "ETH amount to add")

task("removeLiquidity", "removes Liquidity", require("./removeLiquidity"))
  .addParam("targetNetwork", "the name destination chain")

task("swap", "swap", require("./swap"))
  .addParam("targetNetwork", "the name destination chain")


task("swapAndBridge", "swaps and bridge", require("./swapAndBridge"))
  .addParam("targetNetwork", "the destination chainId")
  .addParam("amount", "amount to swap")

task("deposit", "wrap your native tokens", require("./deposit"))
  .addParam("amount", "amount to wrap")

task("withdraw", "unwrap your native token", require("./withdraw"))
  .addParam("amount", "amount to unwrap")

task("getPrice", "info", require("./getPrice"))

task("info", "info", require("./info"))

task("getSigners", "show the signers of the current mnemonic", require("./getSigners"))
  .addOptionalParam("n", "how many to show", 3, types.int)

task("verifyContract", "", require("./verifyContract.js"))
  .addParam("contract", "contract name")

task("send", "", require("./send.js"))
  .addParam("targetNetwork", "the destination chainId")
  .addParam("amount", "amount to bridge")
  .addParam("contract", "contract name")
  
