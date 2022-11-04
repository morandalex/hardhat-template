import "@nomiclabs/hardhat-ethers";
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import "@nomiclabs/hardhat-etherscan";
import * as fs from 'fs';

import 'hardhat-deploy';
import { HardhatUserConfig } from 'hardhat/config';


import 'tsconfig-paths/register';
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

const getMnemonic = () => {
  try {
    return fs.readFileSync('./mnemonic.secret').toString().trim();
  } catch (e) {
    // @ts-ignore
    if (defaultNetwork !== 'localhost') {
      console.log('☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`.');
    }
  }
  return '';
};

let INFURA_KEY                      = process.env.INFURA_KEY                    || ''
let POLYGONSCAN_API_KEY             = process.env.POLYGONSCAN_API_KEY           || ''
let ETHERSCAN_API_KEY               = process.env.ETHERSCAN_API_KEY             || ''
let GOERLI_DEPLOYER_PRIVATE_KEY     = process.env.GOERLI_DEPLOYER_PRIVATE_KEY   || ''
let MUMBAI_DEPLOYER_PRIVATE_KEY     = process.env.MUMBAI_DEPLOYER_PRIVATE_KEY   || ''
let POLYGON_DEPLOYER_PRIVATE_KEY    = process.env.POLYGON_DEPLOYER_PRIVATE_KEY  || ''
let HARDHAT_DEPLOYER_PRIVATE_KEY    = process.env.HARDHAT_DEPLOYER_PRIVATE_KEY  || ''


if (
!INFURA_KEY          &&  INFURA_KEY         !== '' &&
!POLYGONSCAN_API_KEY             &&  POLYGONSCAN_API_KEY            !== '' &&
!ETHERSCAN_API_KEY               &&  ETHERSCAN_API_KEY              !== '' &&
!GOERLI_DEPLOYER_PRIVATE_KEY     &&  GOERLI_DEPLOYER_PRIVATE_KEY    !== '' &&
!MUMBAI_DEPLOYER_PRIVATE_KEY     &&  MUMBAI_DEPLOYER_PRIVATE_KEY    !== '' &&
!POLYGON_DEPLOYER_PRIVATE_KEY    &&  POLYGON_DEPLOYER_PRIVATE_KEY   !== '' &&
!HARDHAT_DEPLOYER_PRIVATE_KEY    && HARDHAT_DEPLOYER_PRIVATE_KEY    !=='' 
) {
  throw new Error('CHECK .env file ,some vars are missing');
} 



const defaultNetwork = 'localhost';
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  defaultNetwork,

  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
  networks: {
    localhost: {
      url: 'http://localhost:8545',
      accounts: [HARDHAT_DEPLOYER_PRIVATE_KEY]
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`, 
      accounts: [],

    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_KEY}`, 
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_KEY}`, 
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_KEY}`, 
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_KEY}`, 
      gasPrice: 50000000000,
      accounts: [GOERLI_DEPLOYER_PRIVATE_KEY],
    },
    xdai: {
      url: 'https://rpc.xdaichain.com/',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: getMnemonic(),
      },
    },
    polygon: {
      url: 'https://rpc-mainnet.maticvigil.com/',
      gasPrice: 100000000000,
      accounts: [POLYGON_DEPLOYER_PRIVATE_KEY]
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`,
      gasPrice: 50000000000,
      accounts: [MUMBAI_DEPLOYER_PRIVATE_KEY]
    },

    optimism: {
      url: `https://optimism-mainnet.infura.io/v3/${INFURA_KEY}`,
      gasPrice: 1200000000000,
      accounts: []
    }
  },
  etherscan: {
    //@ts-ignore
    apiKey: {
      mainnet:ETHERSCAN_API_KEY,
      goerli:ETHERSCAN_API_KEY,
      polygon: POLYGONSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY
    },

  },
  solidity: {
    compilers: [
      {
        version: '0.8.7',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.6.7',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    cache: './generated/cache',
    artifacts: './generated/artifacts',
    //@ts-ignore
    deployments: './generated/deployments',
  },
  typechain: {
    outDir: './generated/contract-types',
  },
};


const DEBUG = false;

function debug(text: string) {
  if (DEBUG) {
    console.log(text);
  }
}

export default config;