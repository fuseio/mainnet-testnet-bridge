const CHAIN_IDS = require("../constants/chainIds.json")
const NATIVE_OFT_ARGS = require("../constants/nativeOftArgs.json")

module.exports = async function (taskArgs, hre) {
  const signers = await ethers.getSigners()
  const owner = signers[0]
  
  const amount = ethers.utils.parseEther(taskArgs.amount)
  const nativeOft = await ethers.getContract(NATIVE_OFT_ARGS[hre.network.name].contractName)

  const tx = await nativeOft.deposit({ value: amount})
  console.log(`Transaction tx: ${tx.hash}\n`)
  await tx.wait()
}