// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@layerzerolabs/solidity-examples/contracts/token/oft/IOFTCore.sol";
import "./INativeOFT.sol";

contract SwappableBridge {
    INativeOFT public immutable nativeOft;
    IUniswapV2Router02 public immutable uniswapRouter;

    constructor(address _nativeOft, address _uniswapRouter) {
        require(_nativeOft != address(0), "SwappableBridge: invalid Native OFT address");
        require(_uniswapRouter != address(0), "SwappableBridge: invalid Uniswap Router address");

        nativeOft = INativeOFT(_nativeOft);
        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
    }

    function swapAndBridge(address _oft, uint amountIn, uint amountOutMin, uint16 dstChainId, address to, address payable refundAddress, address zroPaymentAddress, bytes calldata adapterParams) external payable {
        require(_oft != address(0), "SwappableBridge: invalid OFT address");
        require(to != address(0), "SwappableBridge: invalid to address");
        require(msg.value >= amountIn, "SwappableBridge: not enough value sent");
        
        IOFTCore oft = IOFTCore(_oft);
        address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH();
        path[1] = _oft;

        uint[] memory amounts = uniswapRouter.swapExactETHForTokens{value: amountIn}(amountOutMin, path, address(this), block.timestamp);
        oft.sendFrom{value: msg.value - amountIn}(address(this), dstChainId, abi.encodePacked(to), amounts[1], refundAddress, zroPaymentAddress, adapterParams);
    }

    function bridge(uint amountIn, uint16 dstChainId, address to, address payable refundAddress, address zroPaymentAddress, bytes calldata adapterParams) external payable {
        require(to != address(0), "SwappableBridge: invalid to address");
        require(msg.value >= amountIn, "SwappableBridge: not enough value sent");

        nativeOft.deposit{value: amountIn}();
        nativeOft.sendFrom{value: msg.value - amountIn}(address(this), dstChainId, abi.encodePacked(to), amountIn, refundAddress, zroPaymentAddress, adapterParams);
    }
}