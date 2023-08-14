
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

  const { ratio } = await getTokenRatio(hre.network.name, taskArgs.targetNetwork)
  const uniswapRouter = new ethers.Contract(ROUTERS[hre.network.name], UniswapV2Router02Json.abi, owner)
  const pool = new ethers.Contract(POOLS[hre.network.name][taskArgs.targetNetwork], UniswapV2PairJson.abi, owner)
  const wethAddress = await uniswapRouter.WETH()
  const weth = new ethers.Contract(wethAddress, IERC20.abi, owner)
  const wethSymbol = await weth.symbol()
  const oft = await ethers.getContract(OFT_ARGS[hre.network.name][taskArgs.targetNetwork].contractName)
  const oftSymbol = await oft.symbol()
  const oftReserveRaw = await oft.balanceOf(pool.address)
  const oftReserve = parseFloat(ethers.utils.formatEther(oftReserveRaw))
  const wethReserveRaw = await weth.balanceOf(pool.address)
  const wethReserve = parseFloat(ethers.utils.formatEther(wethReserveRaw))

  const ratioInPool = parseFloat(oftReserve) / parseFloat(wethReserve)
  const ratioInMarket = ratio


  console.log(`Pool Price: 1 ${wethSymbol} = ${ratioInPool.toFixed(6)} ${oftSymbol}`);
  console.log(`Market Price: 1 ${wethSymbol} = ${ratioInMarket.toFixed(6)} ${oftSymbol}`);


  const difference = Math.abs(ratioInPool - ratioInMarket)
  const arbitrageAmount = difference / (2 * ratioInPool) * oftReserve

  const amountToSwap = ethers.utils.parseEther(arbitrageAmount.toFixed(18))
  let tx
  if (ratioInMarket > ratioInPool) {
    console.log(`You must sell ${arbitrageAmount.toFixed(6)} ${oftSymbol}`);

    if (taskArgs.swap) {

      const allowance = await oft.allowance(owner.address, uniswapRouter.address)
      if (amountToSwap.gt(allowance)) {
        console.log('Calling Approval for UniswapRouter..');
        tx = await oft.approve(uniswapRouter.address, amountToSwap)
        await tx.wait()
        console.log(`Approve tx: ${tx.hash}`)
      }

      console.log('Calling swap..');

      const [_, amountOutMin] = await uniswapRouter.getAmountsOut(amountToSwap, [oft.address, weth.address])
      tx = await uniswapRouter.swapExactTokensForETH(
        amountToSwap,
        amountOutMin,
        [oft.address, wethAddress],
        owner.address,
        (Date.now() + 5 * 60)
      )

      tx.wait()
      console.log(`Swap tx: ${tx.hash}`);
    }
  } else {
    console.log(`You must buy ${arbitrageAmount.toFixed(6)} ${oftSymbol}`);

    if (taskArgs.swap) {
      
      const [amountInMax] = await uniswapRouter.getAmountsIn(amountToSwap, [wethAddress, oft.address])
      console.log('Calling swap..');
      tx = await uniswapRouter.swapETHForExactTokens(
        amountToSwap,
        [wethAddress, oft.address],
        owner.address,
        (Date.now() + 5 * 60),
        {
          value: amountInMax
        }
      )
      tx.wait()
      console.log(`Swap tx: ${tx.hash}`);
    }
  }




  // console.log(`1 ${tokenSymbol} = ${inversedRatio.toFixed(6)} ${ethSymbol}`);
  // console.log("-------------------------------------");
  // console.log(`If you want add ${taskArgs.ethAmount} ${ethSymbol}, you must add ${(ratio * taskArgs.ethAmount).toFixed(6)} ${tokenSymbol}`);
}