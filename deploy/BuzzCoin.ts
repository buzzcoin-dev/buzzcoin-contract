import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {getContract} from "hardhat-deploy-ethers/internal/helpers";


const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const accounts = await hre.getNamedAccounts();
    const deployer = accounts.admin;

    const {address: lib} = await hre.deployments.deploy(
        "IterableMapping",
        {from: deployer, log: true,}
    );
    
    await hre.run("verify:verify", {
        address: lib,
    });
    
    const args = [
        "0x10ed43c718714eb63d5aa57b78b54704e256024e", // pancake swap
        "0x050b1d7D1CC92Ccc5538CBeFE7E5682114631e01",
    ];
    const {address} = await hre.deployments.deploy("BuzzCoin", {
        from: deployer,
        args: args,
        log: true,
        libraries: {
            IterableMapping: lib,
        }
    });

    await hre.run("verify:verify", {
        address: address,
        constructorArguments: args,
        libraries: {
            IterableMapping: lib,
        }
    });
};

func.tags = ["BuzzCoin"];

export default func;
