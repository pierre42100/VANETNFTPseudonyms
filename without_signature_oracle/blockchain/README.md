# The Blockchain

## Install dependencies 
> **Note :** NodeJS must be installed on the machine

```bash
npm install
```

## Run project commands
```shell
npx hardhat help
npx hardhat test

# Run test units
REPORT_GAS=true npx hardhat test

# Try to deploy the SmartContracts
npx hardhat run scripts/deploy.ts

# Run a temporary HardHat node
npx hardhat node

# Deploy the SmartContracts locally
npx hardhat run scripts/deploy.ts --network localhost
```
