require('dotenv').config({ path: './.env.local' });

const DB = require('./db');
const {rpc} = require('./kmd-rpc');

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

(async() => {
  await db.open();
  const status = await db.getStatus();
  lastBlockChecked = status.lastBlockChecked;
  helpers.log('status', status)
  syncTip();
})();