# With Signature Oracle Client

* `eca_client.js`: ECA Oracle in charge of codes issuance.
* `sig_oracle.js`: Signature oracle in charge of signing NFTs data.
* `time_oracle.js`: Time oracle in charge of updating the time in the blockchain
* `vehicle_exchange.js`: NFT issuance and usage simulation

## Install dependencies
```bash
npm install
```

## Run project

> **Warning!** The HardHat blockchain must have been previously launched, and the SmartContract must have been deployed! [Learn more in the README of the blockchain](../blockchain/README.md)


### Run ECA ORACLE
```bash
node eca_client.js
```

### Run TIME ORACLE
```bash
node time_oracle.js
```

### Run SIGNATURE ORACLE
```bash
node sig_oracle.js
```

### Simulate NFT issuance and vehicle exchange
```bash
node vehicle_exchange.js
```

### Simulate everything, with 100 NFT issuance
```bash
bash test-protocol.sh
```