const CHAIN_IDS = require("../constants/chainIds.json")
const OFT_ARGS = require("../constants/oftArgs.json")

module.exports = async function (taskArgs, hre) {
  const signers = await hre.ethers.getSigners()
  const owner = signers[0]
  const dstChainId = CHAIN_IDS[taskArgs.targetNetwork]
  const amount = hre.ethers.utils.parseEther(taskArgs.amount)
  const oft = await hre.ethers.getContract(OFT_ARGS[hre.network.name][taskArgs.targetNetwork].contractName)
  const bridge = await hre.ethers.getContract("SwappableBridge")
  const nativeFee = (await oft.estimateSendFee(dstChainId, owner.address, amount, false, "0x")).nativeFee
  const increasedNativeFee = nativeFee.mul(5).div(4)

  let tx = await bridge.swapAndBridge(
    oft.address,
    amount,
    "0",
    dstChainId,
    owner.address,
    owner.address,
    hre.ethers.constants.AddressZero,
    "0x",
    { value: amount.add(increasedNativeFee) }
  )
  await tx.wait()
  console.log(`Transaction tx ${tx.hash}`)
}