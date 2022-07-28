const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
require("dotenv").config()

const mnemonic = fs.readFileSync(".secret").toString().trim();

const etherscanAPIKey = String(process.env.VUE_APP_ETHERSCAN_API_KEY);
const rinkebyRPCURL = String(process.env.VUE_APP_RINKEBY_RPC_URL);

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, rinkebyRPCURL),
      network_id: 4,
      confirmations: 2,
      timeoutBlocks: 200,
      networkCheckTimeout: 50000,
      skipDryRun: true,
      gas: 4500000,
      gasPrice: 10000000000
    },
  },
  contracts_directory: './contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.8.14",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: etherscanAPIKey
  }
}
