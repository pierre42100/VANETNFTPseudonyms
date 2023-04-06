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

## Deploy the project using Ganache instead
```bash
# Run ganache node
docker run -p 8545:8545 --rm trufflesuite/ganache:v7.7.6 --wallet.deterministic --wallet.totalAccounts=5

# Deploy the SmartContracts
npx hardhat run scripts/deploy.ts --network ganache
```