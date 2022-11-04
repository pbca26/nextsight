const MongoClient = require('mongodb').MongoClient;
const {log} = require('./helpers');

class DBController {
  constructor(config) {
    this.name = config.name;
    this.url = config.url;
    this.client = null;
    this.db = null;
  }

  open() {
    const self = this;
  
    if (!this.client) {
      return new Promise(async(resolve, reject) => {
        const client = new MongoClient(self.url);
        await client.connect();

        const db = client.db(self.name);
        self.client = client;
        self.db = db;
        resolve(true);
      });
    }
  };
  
  close() {
    if (this.client) {
      this.client.close();
      this.client = null;
      this.db = null;
    }
  };
  
  getStatus() {
    const self = this;
  
    return new Promise((resolve, reject) => {
      if (self.db) {
        self.db
          .collection('status')
          .findOne({}, (err, result) => {
            if (err) throw err;
            //log(result);
            resolve(result);
          });
      }
    });
  };
  
  updateStatus(blockNum, tip) {
    const self = this;
  
    return new Promise((resolve, reject) => {
      if (self.db) {
        self.db
          .collection('status')
          .findOne({}, (err, result) => {
            if (err) throw err;
    
            self.db
              .collection('status')
              .update(
                result && result['_id'] ? {
                  _id: result['_id'],
                } : {},
                {$set: {lastBlockChecked: blockNum, tip}},
                {upsert: true},
                (err, result) => {
                  if (err) throw err;
                  //log(result);
                  resolve(result);
                });
          });
      }
    });
  };
  
  updateTokens(token) {
    const self = this;
  
    return new Promise((resolve, reject) => {
      if (self.db) {
        self.db
          .collection('tokens')
          .update(
            {
              tokenid: token.tokenid,
            },
            {$set: token},
            {upsert: true},
            (err, result) => {
              if (err) throw err;
              //log(result);
              resolve(result);
            });
      }
    });
  };
  
  getTokenList() {
    const self = this;
  
    return new Promise((resolve, reject) => {
      if (self.db) {
        self.db
          .collection('tokens')
          .find({}, {projection:{_id:0}})
          .toArray((err, result) => {
            if (err) throw err;
            //log(result);
            resolve(result);
          });
      }
    });
  };

  getTokenInfo(tokenId) {
    const self = this;
  
    return new Promise((resolve, reject) => {
      if (self.db) {
        self.db
          .collection('tokens')
          .findOne({
            tokenid: tokenId,
          }, {projection:{_id:0}},
          (err, result) => {
            if (err) throw err;
            //log(result);
            resolve(result);
          });
      }
    });
  };
  
  updateBalances(tokenid, address, balance) {
    const self = this;
  
    return new Promise((resolve, reject) => {
      if (self.db) {
        self.db
          .collection('balances')
          .update(
            {
              tokenid: tokenid,
              address: address,
            },
            {$inc: {balance: balance}},
            {upsert: true},
            (err, result) => {
              if (err) throw err;
              //log(result);
              resolve(result);
            });
      }
    });
  };
  
  getAddressBalance(tokenid, address) {
    const self = this;
  
    return new Promise((resolve, reject) => {
      if (self.db) {
        if (tokenid) {
          self.db
            .collection('balances')
            .findOne(
              {
                tokenid: tokenid,
                address: address,
              },
              {projection:{_id:0}},
              (err, result) => {
                if (err) throw err;
                //log(result);
                resolve(result);
              });
        } else {
          self.db
            .collection('balances')
            .find(
              {
                address: address,
              },
              {projection:{_id:0}}
            )
            .toArray((err, result) => {
              if (err) throw err;
              //log(result);
              resolve(result);
            });
        }
      }
    });
  };
  
  getRichlist(tokenid) {
    const self = this;
  
    return new Promise((resolve, reject) => {
      if (self.db) {
        self.db
          .collection('balances')
          .find(
            {
              tokenid: tokenid,
            },
            {projection:{_id:0,tokenid:0}}
          )
          .toArray((err, result) => {
            if (err) throw err;
            //log(result);
            resolve(result);
          });
      }
    });
  };
  
  getAddressTransactions(tokenid, address, txid) {
    const self = this;
  
    return new Promise((resolve, reject) => {
      if (self.db) {
        let searchTerm = tokenid ? {
          tokenid: tokenid,
          $or: [{
            from: address
          },
          {
            to: address
          }],
        } : {
          $or: [{
            from: address
          },
          {
            to: address
          }],
        };
  
        if (txid && !address) {
          searchTerm = {
            txid: txid,
            tokenid: tokenid,
          };
        } else if (txid && address) {
          searchTerm.txid = txid;
        }
  
        self.db
          .collection('transactions')
          .find(searchTerm, {projection:{_id:0}})
          .toArray((err, result) => {
            if (err) throw err;
            //log(result);
            resolve(result);
          });
      }
    });
  };
  
  getTokenTransactions(tokenid) {
    const self = this;
  
    return new Promise((resolve, reject) => {
      if (self.db) {
        self.db
          .collection('transactions')
          .find(
            {
              tokenid: tokenid,
            },
            {projection:{_id:0}}
          )
          .toArray((err, result) => {
            if (err) throw err;
            //log(result);
            resolve(result);
          });
      }
    });
  };
  
  getAllTokenTransactions(unconf) {
    const self = this;
  
    return new Promise((resolve, reject) => {
      if (self.db) {
        self.db
          .collection('transactions')
          .find(
            unconf ? {
              height: -1,
            } : {},
            {projection:{_id:0}}
          )
          .toArray((err, result) => {
            if (err) throw err;
            //log(result);
            resolve(result);
          });
      }
    });
  };
  
  updateDexTradesStats = (tokenid, volume) => {
    const self = this;
  
    return new Promise((resolve, reject) => {
      if (self.db) {
        self.db
          .collection('stats')
          .update(
            {
              tokenid: tokenid,
            },
            {$inc: {count: 1, volume: volume}},
            {upsert: true},
            (err, result) => {
              if (err) throw err;
              //log(result);
              resolve(result);
            });
      }
    });
  };
  
  updateTransactions(tx) {
    const self = this;
  
    return new Promise((resolve, reject) => {
      if (self.db) {
        self.db
          .collection('transactions')
          .update(
            {
              tokenid: tx.tokenid,
              txid: tx.txid,
            },
            {$set: tx},
            {upsert: true},
            (err, result) => {
              if (err) throw err;
              //log(result);
              resolve(result);
            });
      }
    });
  };
  
  getTokenDexTrades(tokenid) {
    const self = this;
  
    return new Promise((resolve, reject) => {
      if (self.db) {
        self.db
          .collection('transactions')
          .find(
            {
              tokenid: tokenid,
              $or: [{
                type: 'fill',
              },
              {
                type: 'fillbid',
              },
              {
                type: 'fillask',
              }],
            },
            {projection:{_id:0}}
          )
          .toArray((err, result) => {
            if (err) throw err;
            //log(result);
            resolve(result);
          });
      }
    });
  };
  
  getTokenDexStats(tokenid) {
    const self = this;
  
    return new Promise((resolve, reject) => {
      if (self.db) {
        self.db
          .collection('stats')
          .findOne(
            {
              tokenid: tokenid,
            },
            {projection:{_id:0}},
            (err, result) => {
              if (err) throw err;
              //log(result);
              resolve(result);
            });
      }
    });
  };

  updateAddressIndex(indexInfo) {
    const self = this;
  
    return new Promise((resolve, reject) => {
      if (self.db) {
        self.db
          .collection('ccIndex')
          .update(
            {
              raddress: indexInfo.raddress,
            },
            {$set: {
              raddress: indexInfo.raddress,
              cindex1: indexInfo.cindex1,
              cindex2: indexInfo.cindex2,
            }},
            {upsert: true},
            (err, result) => {
              if (err) throw err;
              //log(result);
              resolve(result);
            });
      }
    });
  };

  getAddressIndex(address) {
    const self = this;
  
    return new Promise((resolve, reject) => {
      if (self.db) {
        self.db
          .collection('ccIndex')
          .findOne({
            $or:
              [{
                raddress: address
              },
              {
                cindex1: address
              },
              {
                cindex2: address
              }],
            },
            {projection:{_id:0}},
            (err, result) => {
              if (err) throw err;
              //log(result);
              resolve(result);
            });
      }
    });
  };

  updateOrders(orders) {
    const self = this;
    
    return new Promise(async(resolve, reject) => {
      if (self.db) {
        // slower than drop, keeping it this way in case indexes will be required in the future
        await self.db.collection('orders').deleteMany({});

        self.db.collection('orders')
        .insertMany(orders, (err, result) => {
          if (err) throw err;
          resolve(result);
        });
      }
    });
  }
};

module.exports = DBController;