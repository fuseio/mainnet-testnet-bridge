<div align="center">
    <img alt="LayerZero" src="resources/LayerZeroLogo.png"/>
</div>

---

# Fuse to Gnosis Bridge

## Getting Started

### Setup

- Clone the repository
- run `yarn`

## Introduccion

Basically, there are two token contracts: **NativeOFT** and **OFT**.

The **NativeOFT** contract represents the native token of the network where the contract is implemented, in this case Fuse. This token will be used to wrap Fuse and create the **Native Fuse (FUSE)** token.

On the other hand, the **OFT** contract is the contract implemented on the chain where we want to bridge, in this case Gnosis. This token represents **Native Fuse (FUSE)** in Gnosis and is called **Mainnet Fuse (MFUSE)**.

To give an example, let's say I have native tokens on Fuse. What I do is wrap those tokens in the **NativeOFT** contract and call the sendFrom function. The result is that I receive **OFT** tokens on the destination chain, in this case Gnosis.

The idea is to have a **WXDAI <> MFUSE** pool in Gnosis. So, the user swaps **WXDAI** for **MFUSE** and executes sendFrom on the **OFT** contract to receive **Native Fuse (FUSE)** tokens on Fuse.

The same idea works in reverse. In Gnosis, the **NativeOFT** contract has been implemented to represent **Native xDai (xDAI)**. The same process as with **Native Fuse** can be done, and once the transaction reaches Fuse from Gnosis, **MxDAI** tokens representing **Mainnet xDAI (MxDAI)** are received using the **OFT** contract.

## Scripts

**deposit**: This script takes the parameters 'network' and 'amount'. It wraps your native tokens and creates the NativeOFT token called **Native Fuse (FUSE)**.

Example:
```css
npx hardhat --network fuse deposit --amount 0.1
```

**withdraw**: This script takes the parameters 'network' and 'amount'. It unwraps your native tokens and burns the **Native Fuse (FUSE)** tokens.

Example:
```css
npx hardhat --network fuse withdraw --amount 0.1
```

**send**: This script takes the parameters 'network', 'amount', 'targetNetwork', and 'contract'. It basically sends NativeOFT or OFT tokens to the target chain.

Example:
```css
npx hardhat --network fuse send --amount 0.01 --target-network gnosis --contract NativeOFT
```

**bridge**: This script takes the parameters 'network', 'amount', and 'targetNetwork'. It combines the functionality of deposit and send into a single script.

Example:
```css
npx hardhat --network fuse bridge --target-network gnosis --amount 0.1
```

**swapAndBridge**: takes the parameters 'network', 'amount', and 'targetNetwork'. Essentially, this script performs a swap with the OFT token, in this case, the Mainnet Fuse (MFUSE) token implemented on the Gnosis network. It swaps WXDAI for MFUSE and then sends the MFUSE tokens to the Fuse network. To execute this script, there must be liquidity available for the transaction. The 'amount' parameter represents the quantity of MFUSE tokens you want to receive. 

Example:
```css
npx hardhat --network gnosis swapAndBridge --target-network fuse --amount 0.1
```



>NOTE: The scripts **swapAndBridge**, **addLiquidity**, and **removeLiquidity** are not functional. First, you need to create >liquidity pools and complete the addresses in **/constants/pools.json**.




