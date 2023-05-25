const POOLS = require("../constants/pools.json")
const WETHS = require("../constants/wrappedTokens.json")
const ERC20Json = require("../test/abi/IERC20.json")
const OFT_ARGS = require("../constants/oftArgs.json")
const NATIVE_OFT_ARGS = require("../constants/nativeOftArgs.json")


module.exports = async function (taskArgs, hre) {
  const signers = await ethers.getSigners()
  const owner = signers[0]
  // const poolAddress = POOLS[hre.network.name]
  // const weth = new ethers.Contract(WETHS[hre.network.name], ERC20Json.abi, owner)
  const oft = await ethers.getContract(OFT_ARGS[hre.network.name].contractName)
  const nativeOft = await ethers.getContract(NATIVE_OFT_ARGS[hre.network.name].contractName)

  console.log(`Account: ${owner.address}`);
  console.log(`${hre.network.config.symbol} balance: ${ethers.utils.formatEther(await hre.ethers.provider.getBalance(owner.address))}`)
  console.log(`${(await nativeOft.name())} balance: ${ethers.utils.formatEther(await nativeOft.balanceOf(owner.address))}`)
  console.log(`${(await oft.name())} balance: ${ethers.utils.formatEther(await oft.balanceOf(owner.address))}`)

  // console.log(`ETH owner balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(owner.address))}`)

  // console.log(`OFT pool balance:  ${ethers.utils.formatEther(await oft.balanceOf(poolAddress))}`);
  // console.log(`ETH pool balance:  ${ethers.utils.formatEther(await weth.balanceOf(poolAddress))}`);
}