require("dotenv").config();

require('hardhat-contract-sizer');
require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");
require('hardhat-gas-reporter');
require('hardhat-deploy');
require('hardhat-deploy-ethers');
require('@openzeppelin/hardhat-upgrades');
require('./tasks');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// function getMnemonic(networkName) {
//   if (networkName) {
//     const mnemonic = process.env['MNEMONIC_' + networkName.toUpperCase()]
//     if (mnemonic && mnemonic !== '') {
//       return mnemonic
//     }
//   }

//   const mnemonic = process.env.MNEMONIC
//   if (!mnemonic || mnemonic === '') {
//     return 'test test test test test test test test test test test junk'
//   }

//   return mnemonic
// }

// function accounts(chainKey) {
//   return { mnemonic: getMnemonic(chainKey) }
// }

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const PRIVATE_KEY = process.env.PRIVATE_KEY


module.exports = {

  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }    
    ]
  },
  contractSizer: {
    alphaSort: false,
    runOnCompile: true,
    disambiguatePaths: false,
  },

  namedAccounts: {
    deployer: {
      default: 0,    // wallet address 0, of the mnemonic in .env
    }
  },

  networks: {
    fuse: {
      url: "https://rpc.fuse.io",
      chainId: 122,
      accounts: [PRIVATE_KEY],
    },
    gnosis: {
      url: "https://rpc.ankr.com/gnosis",
      chainId: 100,
      accounts: [PRIVATE_KEY]
    }
  }
};
