## NFT contract


### How to run

* Clone the repository then go to the cloned folder
* Install ```node_modules``` by running this command:
```bash
npm install
// or
yarn install
```
* Rename ```.env.example``` to ```.env```, then add your private key
```bash
P_KEY=YOUR_PRIVATE_KEY_HERE
```
* Then test compile with following command:
```bash
npx hardhat compile
```

### Test cases

* You can test unit test cases by running following command:
```bash
npx hardhat test
```

* Please check this screenshot:
  ![image](https://github.com/0xjamern/nft-contract/assets/43978164/2f30553c-01e9-4b2a-835f-bf6e83a2761c)


### Deploy

* Add your network in ```hardhat.config.js```
* Then run following command:
```bash
npx hardhat run scripts/deploy.js --network your_network
```
