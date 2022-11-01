require('dotenv').config({ path: './.env.local' });

const DB = require('./db');
const {rpc} = require('./kmd-rpc');

const tokenDecoder = require('./token-decoder');
const helpers = require('./helpers');

const TIP_SYNC_INTERVAL = 10;
const BLOCKS_SYNC_DIFF_THRESHOLD = 100;

// TODO: cluster mode
//   main thread to run blocks sync
//   1 worker to pull getinfo and mempool txs
//   1 worker to run tx confs check and tokens integrity check
//   if upsync assign blocks processing to all workers
//   daemon rpcworkqueue must be set to 256 to allow multiple concurrent requests to rpc server

const db = new DB({
  url: process.env.MONGODB_URI,
  name: process.env.MONGODB_NAME,
});

let currentBlock = 0;
let lastBlockChecked = 0;
// catchup - prevent any extra work until current - last block height is above BLOCKS_SYNC_DIFF_THRESHOLD
// default - normal blocks sync
let syncType = 'catchup';

const syncTip = async() => {
  const getinfo = await rpc.getinfo();

  if (getinfo.blocks && Number(getinfo.blocks) > 0) {
    currentBlock = getinfo.blocks;
  }
  helpers.log(`current block ${currentBlock} | last checked block ${lastBlockChecked}`);
  setSyncType();
  await db.updateStatus(lastBlockChecked, currentBlock);
  //helpers.log(getinfo)
};

const setSyncType = () => {
  if (Math.abs(currentBlock - lastBlockChecked) > BLOCKS_SYNC_DIFF_THRESHOLD) {
    syncType = 'catchup';
  } else {
    syncType = 'default';
  }
};

const setupTimers = () => {
  setInterval(() => {
    helpers.log('sync tip');
    syncTip();
  }, TIP_SYNC_INTERVAL * 1000);
};

const syncBlocks = async() => {
  helpers.log(currentBlock, lastBlockChecked)
  if (currentBlock >= lastBlockChecked && currentBlock !== 0) {
    const blockhash = await rpc.getblockhash(lastBlockChecked);
    helpers.log(`processing block ${lastBlockChecked} of ${currentBlock}`);
    //helpers.log(blockhash)
    const blockInfo = await rpc.getblock(blockhash);
    //helpers.log(blockInfo)

    for (let i = 0; i < blockInfo.tx.length; i++) {
      const txHash = blockInfo.tx[i];
      //helpers.log('txHash', txHash)
      const transaction = await rpc.getrawtransaction(txHash, 1);
      if (!transaction.hasOwnProperty('response')) {
        //helpers.log(JSON.stringify(transaction, null, 2))
        const transformedTx = helpers.transformTx(transaction);
        await extractPKtoRaddress(transformedTx);
      
        //helpers.log(JSON.stringify(transformedTx, null, 2));
      
        let decodedTx = tokenDecoder.decodeOpreturn(transformedTx);
        helpers.log(decodedTx)
      
        if (decodedTx && decodedTx.hasOwnProperty('create') && helpers.validateCreateTx(decodedTx)) {
          helpers.log(`create tx at block ${lastBlockChecked}`);

          const tokenInfo = {
            time: transaction.blocktime || Date.now() / 1000,
            height: transaction.height || -1,
            blockhash: transaction.blockhash || -1,
            name: decodedTx.create.name,
            description: decodedTx.create.description,
            owner: decodedTx.create.owner,
            ownerAddress: decodedTx.create.ownerAddress,
            supply: decodedTx.create.supply,
            tokenid: decodedTx.txid,
            data: decodedTx.create.nftData ? {decoded: decodedTx.create.nftData} : decodedTx.create.nftData,
          };

          const tx = {
            to: decodedTx.create.ownerAddress,
            value: decodedTx.create.supply,
            height: transaction.height || -1,
            blockhash: transaction.blockhash || -1,
            txid: decodedTx.txid,
            time: transaction.blocktime || Date.now() / 1000,
            type: 'coinbase',
            tokenid: decodedTx.tokenid,
          };

          helpers.log(tokenInfo)
          await db.updateTokens(tokenInfo);
          await db.updateTransactions(tx);
          await updateCIndexKeys(decodedTx.create.owner, null, pubkeyToAddress(decodedTx.create.owner));
          // update db
        }
      } else {
        helpers.log('error', transaction.response.data);
      }
    }

    await db.updateStatus(lastBlockChecked, currentBlock);
    lastBlockChecked++;
  }

  setImmediate(() => {
    syncBlocks();
  });
};

const updateCIndexKeys = async (pk, transaction, raddress) => {
  const ccIndexKey = await rpc.tokenv2indexkey(pk);

  if (ccIndexKey && !ccIndexKey.hasOwnProperty('response')) {
    await db.updateAddressIndex(ccIndexKey.length === 2 ? {
      raddress: raddress ? raddress : transaction.inputs[i].address,
      cindex1: ccIndexKey[0],
      cindex2: ccIndexKey[1],
    } : {
      address: raddress ? raddress : transaction.inputs[i].address,
      cindex1: ccIndexKey[0],
    });
  }
}

(async() => {
  await db.open();
  const status = await db.getStatus();
  lastBlockChecked = status.lastBlockChecked;
  helpers.log('status', status)
  syncTip();
  setupTimers();
})();