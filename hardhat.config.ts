import { task } from "hardhat/config";
import fs from "fs";

let privateKeyDeploy: string = fs.readFileSync(".privateKeyDeploy").toString().trim() || "";

import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";

dotenvConfig({ path: resolve(__dirname, "./.env") });

import { HardhatUserConfig } from "hardhat/types";
import { NetworkUserConfig } from "hardhat/types";
import ethers from "ethers";

import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";

import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-solhint";
import "solidity-coverage";
import "solidity-docgen";
import "hardhat-contract-sizer";


const chainIds = {
  ganache: 1337,
  hardhat: 1337,
  eth: 1,
  eth_rinkeby: 4,
  eth_ropsten: 3,
  eth_goerli: 5,
  eth_sepolia: 11155111,
  polygon_mumbai: 80001,
  polygon: 137,
  avalanche: 43114,
  avalanche_fuji: 43113,
  bsc: 56,
  bsc_testnet: 97,
  celo: 42220,
  celo_testnet: 44787,
  fuse: 122,
  fuse_testnet: 123,
  energyweb: 246,
  energyweb_testnet: 73799,
};

const MNEMONIC = process.env.MNEMONIC || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const MORALIS_KEY = process.env.MORALIS_KEY || "";
const ALCHEMY_KEY = process.env.ALCHEMY_KEY || "";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.getAddress());
  }
});

task("wallet", "Create a wallet (pk) link", async (_, { ethers }): Promise<void> => {
  // check if the private key is valid and the file .privateKeyDeploy exists
  try {
    if (fs.existsSync(".privateKeyDeploy")) {
      console.log(".privateKeyDeploy already exists");
      // get the private key from the file
      const _privateKeyDeploy = fs.readFileSync(".privateKeyDeploy").toString().trim() || "";
      let wallet = new ethers.Wallet(_privateKeyDeploy);
      console.log("Wallet address:", wallet.address);
    } else {
      const randomWallet = ethers.Wallet.createRandom();
      const { privateKey } = randomWallet._signingKey();
      fs.writeFileSync(`./.generatedWallet/${randomWallet.address}`, privateKey);
      fs.writeFileSync(".privateKeyDeploy", privateKey);

      console.log("Private key saved to .privateKeyDeploy");
      console.log(`🔐 WALLET Generated as ${randomWallet.address}`);
    }
  } catch (err) {}
});

task("generate", "force to create a new wallet (pk) link", async (_, { ethers }): Promise<void> => {
  // check if the private key is valid and the file .privateKeyDeploy exists
  const randomWallet = ethers.Wallet.createRandom();
  const { privateKey } = randomWallet._signingKey();
  fs.writeFileSync(".privateKeyDeploy", privateKey);
  fs.writeFileSync(`./.generatedWallet/${randomWallet.address}`, privateKey);
  console.log("Private key saved to .privateKeyDeploy");
  console.log(`🔐 WALLET Generated as ${randomWallet.address}`);
});

function createNetworkConfig(network: keyof typeof chainIds): NetworkUserConfig | any {
  let url: string = "";
  switch (network) {
    case "bsc_testnet":
      url = "https://data-seed-prebsc-1-s1.binance.org:8545";
      break;
    case "eth_rinkeby":
      url = "https://rinkeby.infura.io/v3/98a728509e2a417c9721ef23cfaae151";
      break;
    case "eth_sepolia":
        url = "https://rpc2.sepolia.org";
        break;
    case "celo_testnet":
      url = "https://alfajores-forno.celo-testnet.org";
      break;
    case "fuse":
      url = "https://rpc.fuse.io";
      break;
    case "fuse_testnet":
      url = "https://rpc.fusespark.io";
      break;
    case "energyweb":
      url = "https://rpc.energyweb.org";
      break;
    case "energyweb_testnet":
      url = "https://volta-rpc.energyweb.org";
      break;
    default:
      url = "https://rpc.ankr.com/" + network;
  }
  // console.log("### hardhat url:", url);
  return {
    _name: network,
    accounts: [privateKeyDeploy],
    chainId: chainIds[network],
    url: url,
  };
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig | any = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      _name: "localhost",
      // accounts: {
      //   mnemonic: MNEMONIC,
      // },
      chainId: chainIds.hardhat,
    },
    ethereum: createNetworkConfig("eth"),
    goerli: createNetworkConfig("eth_goerli"),
    sepolia: createNetworkConfig("eth_sepolia"),
    rinkeby: createNetworkConfig("eth_rinkeby"),
    ropsten: createNetworkConfig("eth_ropsten"),
    mumbai: createNetworkConfig("polygon_mumbai"),
    polygon: createNetworkConfig("polygon"),
    avalanche: createNetworkConfig("avalanche"),
    fuji: createNetworkConfig("avalanche_fuji"),
    binance: createNetworkConfig("bsc"),
    tbinance: createNetworkConfig("bsc_testnet"),
    celo: createNetworkConfig("celo"),
    alfajores: createNetworkConfig("celo_testnet"),
    fuse: createNetworkConfig("fuse"),
    spark: createNetworkConfig("fuse_testnet"),
    energyweb: createNetworkConfig("energyweb"),
    volta: createNetworkConfig("energyweb_testnet"),
  },
  solidity: {
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
    compilers: [
      {
        version: "0.8.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.15",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.8",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.5",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.3",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.1",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.8",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.5",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.7.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    currency: "USD",
    enabled: true,
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  mocha: {
    timeout: 100000000,
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: false,
    strict: true,
    only: [],
  },
};

export default config;
