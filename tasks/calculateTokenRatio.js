
const getTokenRatio = require("../utils/getTokenRatio")

module.exports = async function (taskArgs, hre) {

  if (hre.network.name !== 'fuse' && taskArgs.targetNetwork !== 'fuse') {
    throw new Error('network or targetNetwork must be fuse')
  }

  const {
    ethSymbol,
    tokenSymbol,
    ratio,
    inversedRatio
  } = await getTokenRatio(hre.network.name, taskArgs.targetNetwork)

  console.log(`1 ${ethSymbol} = ${ratio.toFixed(6)} ${tokenSymbol}`);
  console.log(`1 ${tokenSymbol} = ${inversedRatio.toFixed(6)} ${ethSymbol}`);
  console.log("-------------------------------------");
  console.log(`If you want add ${taskArgs.ethAmount} ${ethSymbol}, you must add ${(ratio * taskArgs.ethAmount).toFixed(6)} ${tokenSymbol}`);
}