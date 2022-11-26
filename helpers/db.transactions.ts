import getDbInstance from './db';
import paginate from './paginate';
import getCCIndexKeys from './db.ccindex';
import log from './logger';

const MAX_ITEMS_PER_PAGE = 50;

export const getTokenTransactions = (tokenId: string, page: number = 1) => {
  return new Promise(async(resolve, reject) => {
    const db = await getDbInstance();
    const docFilter = {
      tokenid: tokenId
    };

    log(tokenId);

    const docCount = await db.collection('transactions').countDocuments(docFilter);

    log('total txs', docCount);
    const {total, current} = paginate(docCount, page, MAX_ITEMS_PER_PAGE);
    log(`from ${(current - 1) * MAX_ITEMS_PER_PAGE} to ${current * MAX_ITEMS_PER_PAGE}`);

    if (Number(current) !== Number(page)) {
      resolve([]);
    } else {
      db.collection('transactions')
      .find(
        docFilter,
        {projection:{_id:0}}
      )
      .sort({height: -1})
      .skip((current - 1) * MAX_ITEMS_PER_PAGE)
      .limit(MAX_ITEMS_PER_PAGE)
      .toArray(async(err, result) => {
        if (err) throw err;
        //log(result);
        for (let i = 0; i < result.length; i++) {
          await transformTransactionToRaddressType(result[i]);
        }
        resolve(result);
      });
    }
  });
}

const transformTransactionToRaddressType = async(transaction) => {
  if (transaction.from) {
    const ccIndexRes = await getCCIndexKeys(transaction.from);

    log(transaction.from, ccIndexRes);
    if (ccIndexRes) {
      const {raddress} = ccIndexRes;

      transaction.from = raddress;
    }
  }

  if (transaction.to) {
    const ccIndexRes = await getCCIndexKeys(transaction.to);

    log(transaction.to, ccIndexRes);
    if (ccIndexRes) {
      const {raddress} = ccIndexRes;

      transaction.to = raddress;
    }
  }
};

export const getTokenDexTransactions = (tokenId: string, page: number = 1) => {
  return new Promise(async(resolve, reject) => {
    const db = await getDbInstance();
    const docFilter = {
      tokenid: tokenId,
      $or: [/*{
        order: { $exists: true }
      },*/
      {
        type: 'fill',
      },
      /*{
        type: 'ask',
      },
      {
        type: 'bid',
      },*/
      {
        type: 'fillbid',
      },
      {
        type: 'fillask',
      },
      /*{
        type: 'cancel',
      },
      {
        type: 'cancelask',
      },
      {
        type: 'cancelbid',
      }*/]
    };

    log(tokenId);

    const docCount = await db.collection('transactions').countDocuments(docFilter);

    log('total txs', docCount);
    const {total, current} = paginate(docCount, page, MAX_ITEMS_PER_PAGE);
    log(`from ${(current - 1) * MAX_ITEMS_PER_PAGE} to ${current * MAX_ITEMS_PER_PAGE}`);

    if (Number(current) !== Number(page)) {
      resolve([]);
    } else {
      db.collection('transactions')
      .find(
        docFilter,
        {projection:{_id:0}}
      )
      .sort({height: -1})
      .skip((current - 1) * MAX_ITEMS_PER_PAGE)
      .limit(MAX_ITEMS_PER_PAGE)
      .toArray((err, result) => {
        if (err) throw err;
        //log(result);
        resolve(result);
      });
    }
  });
}

export const getTokenTransaction = (tokenId: string, txid: string) => {
  return new Promise(async(resolve, reject) => {
    const db = await getDbInstance();

    db.collection('transactions')
      .findOne(
        {
          tokenid: tokenId,
          txid,
        },
        {projection:{_id:0}},
        (err, result) => {
          if (err) throw err;
          //log(result);
          resolve(result);
        });
  });
};