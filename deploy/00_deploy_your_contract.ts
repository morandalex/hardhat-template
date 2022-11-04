import { DeployFunction } from 'hardhat-deploy/types';
import { parseEther } from 'ethers/lib/utils';
import { HardhatRuntimeEnvironmentExtended } from '../helpers/types/hardhat-type-extensions';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre as any;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const res = await deploy('Contract', {

    from: deployer,

    log: true,
  });

  const data = {
    contractAddress : res.contractAddress,
    abi:res.abi
  }

  //console.log(data);
};
export default func;
func.tags = ['Contract'];

