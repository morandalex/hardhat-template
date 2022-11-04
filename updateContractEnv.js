require("dotenv").config()
const contracts = require("./contracts_data.json")
const fs = require("fs");
const os = require("os");


function setEnvValue(key, value) {

    // read file from hdd & split if from a linebreak to a array
    const ENV_VARS = fs.readFileSync("./.env", "utf8").split(os.EOL);
    //console.log(ENV_VARS)
    // find the env we want based on the key
    const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
        return line.match(new RegExp(key));
    }));

    // replace the key/value with the new value
    ENV_VARS.splice(target, 1, `${key}=${value}`);

    // write everything back to the file system
    fs.writeFileSync("./.env", ENV_VARS.join(os.EOL));

}
let address=""
console.log('Process env CHAINID selected: ',process.env.TEST_CHAINID)
switch (process.env.TEST_CHAINID){
case '80001':
    address = contracts[80001].mumbai.contracts.Contract.address
    setEnvValue("MUMBAI_CONTRACT", address);
    break;
case '137':
    address = contracts[137].mumbai.contracts.Contract.address
    setEnvValue("POLYGON_CONTRACT", address);
    break;
case '5':
    address = contracts[5].goerli.contracts.Contract.address
    setEnvValue("GOERLI_CONTRACT", address);
    break;
}