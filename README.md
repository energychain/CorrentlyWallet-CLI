# CorrentlyWallet-CLI
**CorrentlyWallet Command Line Interface**

[![asciicast](https://asciinema.org/a/204875.png)](https://asciinema.org/a/204875)

[![CircleCI](https://circleci.com/gh/energychain/CorrentlyWallet-CLI.svg?style=svg)](https://circleci.com/gh/energychain/CorrentlyWallet-CLI)

This wallet is based on CorrentlyWallet library available on: https://www.npmjs.com/package/correntlywallet




## Installation
```
npm install -g correntlywallet-cli
```

## Usage
```
$ corrently help
```

### energy
Prints lifetime generation of electricity associated with this wallet.
```
$ corrently energy
0.0003506081621004566 kWh
```

### market
Prints current OTC market available to wallet
```
$ corrently market
ID	Corrently	Name
#0:	27		PV Plant Gibralta
#1:	32		WindPark Hessen-Süd
#2:	29		WindPark Maingau
```

### buy
Issues an OTC buy transaction.
```
$ corrently buy 1 1
```

## Contributing
- https://stromdao.de/
- https://gitter.im/corrently/Token
