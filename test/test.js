const ethers = require('ethers');
require('dotenv').config()
const hre = require("hardhat");
const { expect } = require('chai');

let contracts = require('./contracts_data.json');

var { SDK: fco } = require('./lib.js');


const chainId = parseInt(process.env.TEST_CHAINID);
let chainName = 'localhost'

switch (chainId) {
  case 31337:
    chainName = 'localhost'
    break;
  case 80001:
    chainName = 'mumbai'
    break;
  case 137:
    chainName = 'polygon'
    break;
    case 5:
    chainName = 'goerli'
    break;


}

console.log('chainId selected: ', chainId)
let mainPrivateKey, user1PrivateKey, user2PrivateKey;
let provider;
let mainWallet, user1Wallet, user2Wallet;
let contractAddress, abi, cMain, cUser1, cUser2;

if (chainId == 31337) {
  provider = new hre.ethers.providers.JsonRpcProvider('http://localhost:8545')
  mainPrivateKey = process.env.HARDHAT_DEPLOYER_PRIVATE_KEY;
  user1PrivateKey = process.env.HARDHAT_PRIVATE_KEY_USER1;
  user2PrivateKey = process.env.HARDHAT_PRIVATE_KEY_USER2;

  mainWallet = new hre.ethers.Wallet(mainPrivateKey, provider)
  //user1Wallet = new hre.ethers.Wallet(user1PrivateKey, provider)
  //user2Wallet = new hre.ethers.Wallet(user2PrivateKey, provider)
  contractAddress = contracts[String(chainId)][String(chainName)].contracts.Contract.address
  abi = contracts[String(chainId)][String(chainName)].contracts.Contract.abi
  cMain = new hre.ethers.Contract(contractAddress, abi, mainWallet)
  //cUser1 = new hre.ethers.Contract(contractAddress, abi, user1Wallet)
  //cUser2 = new hre.ethers.Contract(contractAddress, abi, user2Wallet)

} else {

  //provider = new hre.ethers.providers.AlchemyProvider(chainId, process.env.ALCHEMY_KEY)
  provider = new ethers.providers.InfuraProvider(chainId, process.env.INFURA_KEY)
  mainPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;
  mainWallet = new hre.ethers.Wallet(mainPrivateKey, provider)
  // user1Wallet = hre.ethers.Wallet.createRandom()
  // user2Wallet = hre.ethers.Wallet.createRandom()
  contractAddress = contracts[String(chainId)][String(chainName)].contracts.Contract.address
  abi = contracts[String(chainId)][String(chainName)].contracts.Contract.abi
  cMain = new hre.ethers.Contract(contractAddress, abi, mainWallet)
  //cUser1 = new hre.ethers.Contract(contractAddress, abi, user1Wallet)
  // cUser2 = new hre.ethers.Contract(contractAddress, abi, user2Wallet)
}






console.log('Connected Address  : ', mainWallet.address);
console.log('Contract  Address  : ', contractAddress)
//console.log('Contract activated : ',cMain)


describe("Test", function () {

  it("sendTxWithMessage", async function () {
   

    let signer = mainWallet

    const string = 'MY DOCUMENT HASH';

    let nonce = await provider.getTransactionCount(signer.address, "latest")
    const hexString = fco.utf8ToHex(string);

    let parameters = {
      to: signer.address,
      value: ethers.utils.parseUnits('1', 'wei'),
      nonce: nonce,
      gasLimit: ethers.utils.hexlify(1000000),
      gasPrice: await fco.getGasData(chainId),
      data : hexString
    }

    const tx = await signer.sendTransaction(parameters)
    let receipt = await tx.wait()
    console.log('receipt : ', receipt)

  })
})


