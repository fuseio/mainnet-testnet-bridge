const ROUTERS = require("../constants/uniswapRouters.json")
const POOLS = require("../constants/pools.json")
const OFT_ARGS = require("../constants/oftArgs.json")

const UniswapV2Router02Json = require("../test/abi/UniswapV2Router02.json")
const erc20AbiJson = require("../test/abi/IERC20.json")

module.exports = async function (taskArgs, hre) {
  const signers = await ethers.getSigners()
  const owner = signers[0]
  const uniswapRouter = new ethers.Contract(ROUTERS[hre.network.name], UniswapV2Router02Json.abi, owner)
  const oft = await ethers.getContract(OFT_ARGS[hre.network.name][taskArgs.targetNetwork].contractName)

  const lp = new ethers.Contract(POOLS[hre.network.name][taskArgs.targetNetwork], erc20AbiJson.abi, owner)
  const lpBalance = await lp.balanceOf(owner.address)

  const blockNumber = await ethers.provider.getBlockNumber()
  const block = await ethers.provider.getBlock(blockNumber)
  const deadline = block.timestamp + 5 * 60; // 5 minutes from the current time

  console.log('Calling Approval to UniswapRouter....');
  let tx = await lp.approve(uniswapRouter.address, lpBalance)
  await tx.wait()
  console.log(`[Approve tx: ${tx.hash}`)

  console.log('Calling RemoveLiquidity...');
  tx = await uniswapRouter.removeLiquidityETH(oft.address, lpBalance, "0", "0", owner.address, deadline)
  await tx.wait()
  console.log(`Remove Liquidity tx: ${tx.hash}`)
}