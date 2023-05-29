const CHAIN_IDS = require("../constants/chainIds.json")
const NATIVE_OFT_ARGS = require("../constants/nativeOftArgs.json")

module.exports = async function (taskArgs, hre) {
  const signers = await hre.ethers.getSigners()
  const owner = signers[0]
  const dstChainId = CHAIN_IDS[taskArgs.targetNetwork]
  
  const nativeOft = await hre.ethers.getContract(NATIVE_OFT_ARGS[hre.network.name].contractName)
  const swappableBridge = await hre.ethers.getContract("SwappableBridge")
    
  const amount = hre.ethers.utils.parseEther(taskArgs.amount)
  try {
    const nativeFee = (await nativeOft.estimateSendFee(dstChainId, owner.address, amount, false, "0x")).nativeFee
    const total = nativeFee.mul(5).div(4).add(amount)

    const balance = await hre.ethers.provider.getBalance(owner.address)

    if (!balance.gt(total)) {
      throw new Error(`Insuficient balance.`)
    }

    const tx = await swappableBridge.bridge(
      amount,
      dstChainId,
      owner.address,
      owner.address,
      hre.ethers.constants.AddressZero,
      "0x",
      { value: amount.add(total) }
    )
    await tx.wait()
    console.log(`Transaction tx: ${tx.hash}\n`)
  } catch (error) {
    console.log('error on bridge', error);
  }
}