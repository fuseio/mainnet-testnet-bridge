
const getTokenRatio = require("../utils/getTokenRatio")
const ROUTERS = require("../constants/uniswapRouters.json")
const OFT_ARGS = require("../constants/oftArgs.json")
const POOLS = require("../constants/pools.json")
const UniswapV2Router02Json = require("../test/abi/UniswapV2Router02.json")
const UniswapV2PairJson = require("../test/abi/UniswapV2Pair.json")
const IERC20 = require("../test/abi/IERC20.json")



module.exports = async function (taskArgs, hre) {

  if (hre.network.name !== 'fuse' && taskArgs.targetNetwork !== 'fuse') {
    throw new Error('network or targetNetwork must be fuse')
  }
  const signers = await ethers.getSigners()
  const owner = signers[0]

  const { ratio, ethSymbol, tokenSymbol } = await getTokenRatio(hre.network.name, taskArgs.targetNetwork)
  const uniswapRouter = new ethers.Contract(ROUTERS[hre.network.name], UniswapV2Router02Json.abi, owner)
  const pool = new ethers.Contract(POOLS[hre.network.name][taskArgs.targetNetwork], UniswapV2PairJson.abi, owner)
  const wethAddress = await uniswapRouter.WETH()
  const weth = new ethers.Contract(wethAddress, IERC20.abi, owner)

  const oft = await ethers.getContract(OFT_ARGS[hre.network.name][taskArgs.targetNetwork].contractName)

  const ethAmount = ethers.utils.parseEther("1")
  console.log(ethers.utils.formatEther(ethAmount.sub(ethAmount.div(100).mul(2))));
  // const amountOutMin = ethers.utils.parseEther("0.1")
  // const tx = await uniswapRouter.swapExactETHForTokens(
  //   amountOutMin,
  //   [wethAddress, oft.address],
  //   owner.address,
  //   (Date.now() + 5 * 60),
  //   { value: ethAmount }
  // )
  // tx.wait()
  // console.log(tx.hash);


  // const amountToSwap = ethers.utils.parseEther("0.00005")
  // const amountInMax = ethers.utils.parseEther("1")

  // const allowance = await oft.allowance(owner.address, uniswapRouter.address)
  // if (amountToSwap.gt(allowance)) {
  //   console.log('Calling Approval for UniswapRouter..');
  //   tx = await oft.approve(uniswapRouter.address, amountToSwap)
  //   await tx.wait()
  //   console.log(`Approve tx: ${tx.hash}`)
  // }

  // const tx = await uniswapRouter.swapTokensForExactETH(
  //   amountToSwap,
  //   amountInMax,
  //   [oft.address, wethAddress],
  //   owner.address,
  //   (Date.now() + 5 * 60)
  // )
  // tx.wait()
  // console.log(tx.hash);
  




  // console.log(`1 ${tokenSymbol} = ${inversedRatio.toFixed(6)} ${ethSymbol}`);
  // console.log("-------------------------------------");
  // console.log(`If you want add ${taskArgs.ethAmount} ${ethSymbol}, you must add ${(ratio * taskArgs.ethAmount).toFixed(6)} ${tokenSymbol}`);
}