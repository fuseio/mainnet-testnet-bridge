const CHAIN_IDS = require("../constants/chainIds.json")
const { getDeploymentAddresses } = require("../utils/readStatic")
const OFT_ARGS = require("../constants/oftArgs.json")
const NATIVE_OFT_ARGS = require("../constants/nativeOftArgs.json")

module.exports = async function (taskArgs, hre) {
  const localChain = hre.network.name;
  const remoteChain = taskArgs.targetNetwork;
  const remoteChainId = CHAIN_IDS[remoteChain]
  const localNativeOft = await ethers.getContract(NATIVE_OFT_ARGS[localChain].contractName)
  const remoteNativeOft = getDeploymentAddresses(remoteChain)[NATIVE_OFT_ARGS[remoteChain].contractName]

  const localOft = await ethers.getContract(OFT_ARGS[localChain][remoteChain].contractName)
  const remoteOft = getDeploymentAddresses(remoteChain)[OFT_ARGS[remoteChain][localChain].contractName]

  let tx = await localNativeOft.setTrustedRemoteAddress(remoteChainId, remoteOft)
  console.log(`native OFT setTrustedRemoteAddress tx: ${tx.hash}`)
  await tx.wait()

  tx = await localOft.setTrustedRemoteAddress(remoteChainId, remoteNativeOft)
  console.log(`OFT setTrustedRemoteAddress tx: ${tx.hash}`)
  await tx.wait()
}