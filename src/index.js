'use strict';

import CorrentlyWallet from 'correntlywallet';
const storage = require("node-persist");

let cwcli = async function() {
  await storage.init();
  let privateKey = await storage.getItem("privateKey");
  let wallet = null;
  if( privateKey != null) {
    wallet = new CorrentlyWallet.Wallet(privateKey);
  } else {
    wallet = CorrentlyWallet.Wallet.createRandom();
    await storage.setItem("privateKey",wallet.privateKey);
  }

  const vorpal = require('vorpal')();
  let interactive = vorpal.parse(process.argv, {use: 'minimist'})._ === undefined;

  vorpal
        .command('address', 'prints blockchain address of this wallet')
        .action(function(args, callback) {
          this.log(wallet.address);
          callback();
        });

  vorpal
        .command('market', 'prints market overview')
        .action(function(args, callback) {
          CorrentlyWallet.Market().then(function(market) {
            vorpal.log('ID\tCorrently\tName');
            for(let i=0;i<market.length;i++) {
                vorpal.log('#'+i+':\t'+market[i].cori+"\t\t"+market[i].title);
            }
            callback();
          });
        });
  vorpal
        .command('buy <id> <quantity>', 'prints market overview')
        .action(function(args, callback) {
            let id=args.id;
            let qty=args.quantity;
            if(typeof id == "string") id=id.substr(1)*1;
            CorrentlyWallet.Market().then(function(market) {
              wallet.buyCapacity(market[id], qty).then(function(transaction) {
                  vorpal.log("send.");
                  vorpal.log("type transactions to see all transactions");
                  callback();
              });
            });
        });
  vorpal
        .command('transactions', 'See all transactions of this wallet')
        .action(function(args, callback) {
          CorrentlyWallet.CorrentlyAccount(wallet.address).then(function(_account) {
            vorpal.log("Date/Time \t\tkWh/year \tGeneration Facility (asset)");
            for(let i=0;i<_account.txs.length;i++) {
              let t=_account.txs[i];
              vorpal.log(new Date(t.timeStamp).toLocaleString()+"\t"+t.cori+"\t\t"+t.asset);
            }
            callback();
          });
        });
  vorpal
        .command('FORGET', 'DANGERZONE! This will remove ownership for GDPR compliance')
        .action(function(args, callback) {
            wallet.deleteData(wallet.address).then(function(transaction) {
                vorpal.log("ACCOUNT DELETED!");
                callback();
            });
          });
  vorpal
        .command('energy', 'Generated energy by aquired assets')
        .action(function(args, callback) {
          CorrentlyWallet.CorrentlyAccount(wallet.address).then(function(_account) {
            vorpal.log(_account.generation+" kWh");
            callback();
          });
        });
  vorpal.log("CorrentlyWallet - "+wallet.address);
  vorpal.log("------------------------------------------------------------------------------");


  global.interactive=interactive;
  	if (interactive) {
      vorpal.log("Usage hints: ");
      vorpal.log(" corrently> market \t\t- see current OTC market");
      vorpal.log(" corrently> buy #1 2 \t\t- buy from ID #1 a capacity of 2kWh/yr");
      vorpal.log(" corrently> energy \t\t- retrieve generated electricity");
      vorpal.log(" corrently> transactions \t- see transactions");
      vorpal.log("------------------------------------------------------------------------------");
  		vorpal
  			.delimiter('corrently>')
  			.show();
  	} else {
  		// argv is mutated by the first call to parse.
  		process.argv.unshift('');
  		process.argv.unshift('');
  		vorpal
  			.delimiter('')
  			.parse(process.argv);
  	}
};

cwcli();
