const CHAIN_IDS = require("../constants/chainIds.json")

module.exports = async function (taskArgs, hre) {
  let signers = await hre.ethers.getSigners()
  let owner = signers[0]
  let amount = hre.ethers.utils.parseEther(taskArgs.amount)
  // get remote chain id
  const remoteChainId = CHAIN_IDS[taskArgs.targetNetwork]
  // get local contract
  const localContract = await hre.ethers.getContract(taskArgs.contract)

  // quote fee with default adapterParams
  let adapterParams = hre.ethers.utils.solidityPack(["uint16", "uint256"], [1, 200000]) // default adapterParams example

  let fees = await localContract.estimateSendFee(remoteChainId, owner.address, amount, false, adapterParams)
  console.log(`fees[0] (wei): ${fees[0]} / (eth): ${hre.ethers.utils.formatEther(fees[0])}`)
  let tx = await (
    await localContract.sendFrom(
      owner.address,                 // 'from' address to send tokens
      remoteChainId,                 // remote LayerZero chainId
      owner.address,                     // 'to' address to send tokens
      amount,
      owner.address,
      hre.ethers.constants.AddressZero,
      "0x",
      { value: fees[0].mul(10).div(9) }
    )
  ).wait()
  console.log(`✅ Message Sent [${hre.network.name}] sendTokens() to OFT @ LZ chainId[${remoteChainId}] token:[${owner.address}]`)
  console.log(` tx: ${tx.transactionHash}`)
  console.log(`* check your address [${owner.address}] on the destination chain, in the ERC20 transaction tab !"`)
}
