require('dotenv').config()
const fetch = require("node-fetch");
const ethers = require('ethers');
const axios = require('axios')
const sleep = ms => new Promise(res => setTimeout(res, ms));
async function getGasData(chainid, correctorFactor) {
    let gasData;
    let fee = 100;//DEFAULT

    fee = ethers.utils.parseUnits(
        Math.ceil(fee).toString(),
        "gwei"
    )
    correctorFactor = correctorFactor || 1
    if (chainid == 137) {
        gasData = await fetch('https://gasstation-mainnet.matic.network/v2')
            .then(res => res.json())
            .then(data => { return data })
        fee = ethers.utils.parseUnits(
            Math.ceil(parseFloat(gasData.fast.maxFee) * correctorFactor).toString(),
            "gwei"
        )
    }
    if (chainid == 80001) {
        gasData = await fetch('https://gasstation-mumbai.matic.today/v2')
            .then(res => res.json())
            .then(data => { return data })
        fee = ethers.utils.parseUnits(
            Math.ceil(parseFloat(gasData.fast.maxFee) * correctorFactor).toString(),
            "gwei"
        )
    }
    if (chainid == 5) {

        gasData = await fetch('https://ethgasstation.info/api/ethgasAPI.json?')
            .then(res => res.json())
            .then(data => { return data })

        fee = ethers.utils.parseUnits(
            Math.ceil(parseFloat(gasData.fast.maxFee) * correctorFactor).toString(),
            "gwei"
        )
        console.log(fee.toString())
    }


    return fee;
}
function printScanTx(chainId, txHash) {

    if (chainId == 80001) {
        return 'https://mumbai.polygonscan.com/tx/' + txHash
    }
    if (chainId == 137) {
        return 'https://polygonscan.com/tx/' + txHash
    }
    if (chainId == 5) {
        return 'https://goerli.etherscan.io/tx/' + txHash
    }



    return txHash


}
async function createIpfsDocFromInfura(strToIpfs) {
    // let strToIpfs = 'hello fantacalcio online';
    //let metadata = 'metatag if we need ';

    const INFURA_PROJECT_ID = process.env.INFURA_IPFS_PROJECT_ID
    const INFURA_PROJECT_SECRET = process.env.INFURA_IPFS_SECRET_ID
    const IPFS_GATEWAY_URL = process.env.INFURA_IPFS_DEDICATED_GATEWAY


    let url = 'https://ipfs.infura.io:5001/api/v0/add';
    let projectid = INFURA_PROJECT_ID
    let projectsecret = INFURA_PROJECT_SECRET
    let obj = {}
    try {
        let headers = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'Basic ' + Buffer.from(projectid + ":" + projectsecret).toString('base64')
            }
        };
        let data = {
            'filedata': strToIpfs
        }
        const response = await axios.post(url, data, headers)

        obj = response.data

    } catch (error) {
        //console.error(error);
        obj = error
    }

    return obj;
}
async function sign(wallet, str) {
    //const MNEMONIC = process.env.SIGN_WITH_MNEMONIC;
    //const wallet = new Wallet.fromMnemonic(MNEMONIC, "m/44'/60'/0'/0/0", 'it')
    const hash = utils.keccak256(utils.toUtf8Bytes(str))
    const signature = await wallet.signMessage(hash)
    const expectedAddress = await wallet.getAddress()
    return {
        hash,
        signature,
        verified: wallet.address == expectedAddress ? true : false
    }
}
async function addressGenerator(howmany) {
    let addresses = []
    for (let i = 0; i < howmany; i++) {
        const wallet = ethers.Wallet.createRandom()
        addresses.push(wallet)
    }
    return addresses
}

async function scanApi(txHashInput, moduleInput, actionInput) {
    let txHash = txHashInput || ""
    let module = moduleInput || ""
    let action = actionInput || ""

    let baseApiUrl = ''
    let apikey
    switch (process.env.TEST_CHAINID) {
        case '80001':
            baseApiUrl = "https://api-testnet.polygonscan.com/api?"
            apikey = process.env.POLYGONSCAN_API_KEY
            break;
        case '137':
            baseApiUrl = "https://api.polygonscan.com/api?"
            apikey = process.env.POLYGONSCAN_API_KEY
            break;
        case '5':
            baseApiUrl = "https://api-goerli.etherscan.io/api?"
            apikey = process.env.ETHERSCAN_API_KEY
            break;
    }


    let url = baseApiUrl + "module=" + module + "&action=" + action + "&txhash=" + txHash + "&apikey=" + apikey
    //console.log(url)
    let response = await fetch(url).then(res => res.json()).then(data => { return data })

    return { response, url }
}
async function getTxStatus(txHash) {

    let res = await scanApi(txHash, "transaction", "gettxreceiptstatus")

    let response = res.response
    let status = {}
    status.txHash = txHash
    status.response = response
    status.scanLink = res.url
    status.scanLink2 = printScanTx(process.env.TEST_CHAINID, txHash)
    if (response?.message == 'OK') {
        if (response?.result?.status == "0") {
            status.message = 'tx failed'
        } else
            if (response?.result?.status == "1") {
                status.message = 'tx success'
            } else {
                status.message = 'tx still processing'
            }
    } else {
        status.message = 'tx still processing'
    }
    return status
}
function minifyHash(hash) {
    return hash.substring(0, 4) + "..." + hash.substring(hash.length - 4)
}
async function wait(seconds) {
    console.log()
    for (let i = 0; i < seconds; i++) {
        process.stdout.write('.');
        await sleep(1000);
    }
    console.log()
    console.log()
}

function isEmpty(value) {
    if ((typeof value !== "undefined" && value !== null ) || value !== "" || value !== {} || value !== []) {
        return true
    }
    else {
        return false
    }
}
function getChainName(chainId) {
    switch (chainId) {
        case '80001':
            return 'mumbai'
        case '137':
            return 'polygon'
        case '5':
            return 'goerli'
    }
    return 'localhost'
}
function utf8ToHex(str) {
    return '0x' + Array.from(str).map(c =>
      c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16) :
      encodeURIComponent(c).replace(/\%/g,'').toLowerCase()
    ).join('');
  }
exports.SDK = {
    getGasData,
    printScanTx,
    createIpfsDocFromInfura,
    scanApi,
    minifyHash,
    getTxStatus,
    wait,
    sign,
    addressGenerator,
    isEmpty,
    getChainName,
    utf8ToHex
};

