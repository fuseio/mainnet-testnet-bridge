const CHAIN_IDS = require("../constants/chainIds.json")

module.exports = async function (taskArgs, hre) {
  let signers = await hre.ethers.getSigners()
  let owner = signers[0]
  let amount = hre.ethers.utils.parseEther(taskArgs.amount)
  const remoteChainId = CHAIN_IDS[taskArgs.targetNetwork]
  const localContract = await hre.ethers.getContract(taskArgs.contract)

  try {
    let adapterParams = hre.ethers.utils.solidityPack(["uint16", "uint256"], [1, 200000]) // default adapterParams example
    let fees = await localContract.estimateSendFee(remoteChainId, owner.address, amount, false, adapterParams)
    const increasedFee = fees[0].mul(5).div(4).add(amount)
    const balance = await hre.ethers.provider.getBalance(owner.address)

    if (!balance.gt(increasedFee)) {
      throw new Error(`Insuficient balance.`)
    }

    console.log(`Fee: ${hre.ethers.utils.formatEther(increasedFee)} ${hre.network.config.symbol}`);
    let tx = await (
      await localContract.sendFrom(
        owner.address,                 // 'from' address to send tokens
        remoteChainId,                 // remote LayerZero chainId
        owner.address,                     // 'to' address to send tokens
        amount,
        owner.address,
        hre.ethers.constants.AddressZero,
        "0x",
        { value: increasedFee }
      )
    ).wait()
    console.log(`✅ Message Sent [${hre.network.name}] sendTokens() to OFT @ LZ chainId[${remoteChainId}] token:[${owner.address}]`)
    console.log(` tx: ${tx.transactionHash}`)
    console.log(`* check your address [${owner.address}] on the destination chain, in the ERC20 transaction tab !"`)
  } catch (error) {
    console.log('Error on send task', error);
  }

}
