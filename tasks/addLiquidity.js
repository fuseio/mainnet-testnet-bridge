const ROUTERS = require("../constants/uniswapRouters.json")
const UniswapV2Router02Json = require("../test/abi/UniswapV2Router02.json")
const OFT_ARGS = require("../constants/oftArgs.json")
const getTokenRatio = require("../utils/getTokenRatio")

module.exports = async function (taskArgs, hre) {

  if (hre.network.name !== 'fuse' && taskArgs.targetNetwork !== 'fuse') {
    throw new Error('network or targetNetwork must be fuse')
  }

  const signers = await ethers.getSigners()
  const owner = signers[0]
  const uniswapRouter = new ethers.Contract(ROUTERS[hre.network.name], UniswapV2Router02Json.abi, owner)

  const oft = await ethers.getContract(OFT_ARGS[hre.network.name][taskArgs.targetNetwork].contractName)
  const oftSymbol = await oft.symbol()
  const { ratio } = await getTokenRatio(hre.network.name, taskArgs.targetNetwork)

  
  const ethAmount = ethers.utils.parseEther(taskArgs.ethAmount)
  const oftAmount = ethers.utils.parseEther((ratio * taskArgs.ethAmount).toString())

  console.log('Checking balances..');
  const oftBalance = await oft.balanceOf(owner.address)
  const ethBalance = await ethers.provider.getBalance(owner.address)

  if (ethAmount.gt(ethBalance)) {
    throw new Error(`
    Insuficcient balance.
    Your balance: ${ethers.utils.formatEther(ethBalance)} ETH. 
    Amount required for transaction: ${ethers.utils.formatEther(ethAmount)} ETH.
    `)
  }

  if (oftAmount.gt(oftBalance)) {
    throw new Error(`
    Insuficcient balance.
    Your balance: ${ethers.utils.formatEther(oftBalance)} ${oftSymbol}. 
    Amount required for transaction: ${ethers.utils.formatEther(oftAmount)} ${oftSymbol}.
    `)
  }


  console.log('Checking allowance..');

  const allowance = await oft.allowance(owner.address, uniswapRouter.address)

  let tx
  if (oftAmount.gt(allowance)) {
    console.log('Calling approval for UniswapRouter..');
    tx = await oft.approve(uniswapRouter.address, oftAmount)
    await tx.wait()
    console.log(`Approve tx: ${tx.hash}`)
  }


  const blockNumber = await ethers.provider.getBlockNumber()
  const block = await ethers.provider.getBlock(blockNumber)
  const deadline = block.timestamp + 5 * 60 // 5 minutes from the current time

  const ethAmountMin = ethAmount.sub(ethAmount.div(100).mul(2))
  const oftAmountMin = oftAmount.sub(oftAmount.div(100).mul(2))


  console.log('Calling add liquidity..');
  tx = await uniswapRouter.addLiquidityETH(oft.address, oftAmount, oftAmountMin, ethAmountMin, owner.address, deadline, { value: ethAmount })
  await tx.wait()
  console.log(`Add liquidity tx: ${tx.hash}`)
}