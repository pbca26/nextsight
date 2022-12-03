// ref: https://github.com/pbca26/agama-wallet-lib/blob/master/src/utils.js#L131
const convertExponentialToDecimal = (exponentialNumber, returnAsString = false) => {
  // sanity check - is it exponential number
  const str = exponentialNumber.toString();
  if (str.indexOf('e') !== -1) {
    const exponent = parseInt(str.split('-')[1], 10);
    // Unfortunately I can not return 1e-8 as 0.00000001, because even if I call parseFloat() on it,
    // it will still return the exponential representation
    // So I have to use .toFixed()
    const result = returnAsString ? exponentialNumber.toFixed(exponent).toString() : exponentialNumber.toFixed(exponent);
    return result;
  } else {
    return returnAsString ? exponentialNumber.toString() : exponentialNumber;
  }
}

// ref: https://github.com/pbca26/agama-wallet-lib/blob/master/src/utils.js#L147
const fromSats = (value) => convertExponentialToDecimal(Number(Number(value * 0.00000001).toFixed(8)));

// ref: https://github.com/pbca26/agama-wallet-lib/blob/master/src/utils.js#L149
const toSats = (value) => Number(Number(value * 100000000).toFixed(0));

const transformTx = tx => {
  tx.inputs = tx.vin;
  tx.outputs = tx.vout;
  delete tx.vin;
  delete tx.vout;

  for (let j = 0; j < tx.inputs.length; j++) {
    tx.inputs[j].satoshis = tx.inputs[j].valueSat;
  }

  for (let j = 0; j < tx.outputs.length; j++) {
    tx.outputs[j].scriptAsm = tx.outputs[j].scriptPubKey.asm;
    tx.outputs[j].script = tx.outputs[j].scriptPubKey.hex;
    if (!tx.outputs[j].valueSat) tx.outputs[j].valueSat = tx.outputs[j].value * 100000000;
    tx.outputs[j].satoshis = tx.outputs[j].valueSat;
    if (tx.outputs[j].scriptPubKey.addresses) tx.outputs[j].address = tx.outputs[j].scriptPubKey.addresses[0];
  }

  return tx;
}

const validateCreateTx = tx => {
  if (!tx.hasOwnProperty('txid')) return false;
  if (!tx.hasOwnProperty('type')) return false;
  if (!tx.hasOwnProperty('tokenid')) return false;
  if (!tx.hasOwnProperty('create')) return false;
  if (tx.hasOwnProperty('create') && !tx.create.hasOwnProperty('name')) return false;
  if (tx.hasOwnProperty('create') && !tx.create.hasOwnProperty('supply')) return false;
  if (tx.hasOwnProperty('create') && !tx.create.hasOwnProperty('owner')) return false;
  if (tx.hasOwnProperty('create') && !tx.create.hasOwnProperty('ownerAddress')) return false;

  if (tx.txid.length !== 64) return false;
  if (tx.tokenid.length !== 64) return false;
  if (tx.create.owner.length !== 66) return false;
  if (tx.create.ownerAddress.length !== 34) return false;
  if (!tx.create.name.length) return false;

  return true;
};

const log = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? console.log : () => {};

module.exports = {
  fromSats,
  toSats,
  transformTx,
  validateCreateTx,
  log,
};