require('dotenv').config({ path: './.env.local' });

const SmartChain = require('komodo-rpc-js');

const conf = {
  rpchost: process.env.KMD_RPC_SERVER,
  rpcport: process.env.KMD_RPC_PORT,
  rpcuser: process.env.KMD_RPC_USER,
  rpcpassword: process.env.KMD_RPC_PASS,
};

const sc = new SmartChain({ config: conf });
const rpc = sc.rpc();

module.exports = {
  rpc,
  conf
}