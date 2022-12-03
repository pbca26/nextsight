import getDbInstance from './db';
import paginate from './paginate';
import getCCIndexKeys from './db.ccindex';
import log from './logger';

const MAX_ITEMS_PER_PAGE = 50;

export const getAddressBalance = (tokenId: string, address: string) => {
  return new Promise(async(resolve, reject) => {
    const db = await getDbInstance();
    let ccIndex = [address];
    let docFilter = {
      tokenid: tokenId,
      $or: [
        {
          from: address,
        },
        {
          to: address,  
        }
      ]
    };

    if (address[0] === 'R') {
      log('R-address');
      const ccIndexRes = await getCCIndexKeys(address);

      if (ccIndexRes) {
        const {raddress, cindex1, cindex2} = ccIndexRes;
        ccIndex = [cindex1, cindex2];
        docFilter = {
          tokenid: tokenId,
          $or: [
            {
              from: cindex1,  
            },
            {
              to: cindex1,  
            },
            {
              from: cindex2,  
            },
            {
              to: cindex2,  
            }
          ]
        };
      }
    }

    log(ccIndex);
    log(tokenId);

    const docCount = await db.collection('transactions').countDocuments(docFilter);

    log('total txs', docCount);
    
    db.collection('transactions')
    .find(
      docFilter,
      {projection:{_id:0}}
    )
    .toArray((err, result) => {
      log('getAddressBalance ==>');
      log(result);

      if (err) throw err;
      let balance = 0, txSent = 0, txSentCount = 0, txRecevied = 0, txReceivedCount = 0;

      for (let i = 0; i < result.length; i++) {
        if (result[i].from && ccIndex.indexOf(result[i].from) > -1 && result[i].value) {
          balance -= result[i].value;
          txSent += result[i].value;
          txSentCount++;
        }

        if (result[i].to && ccIndex.indexOf(result[i].to) > -1 && result[i].value) {
          balance += result[i].value;
          txRecevied += result[i].value;
          txReceivedCount++;
        }
      }

      resolve({
        balance,
        transactions: docCount,
        sent: {
          count: txSentCount,
          value: txSent
        },
        received: {
          count: txReceivedCount,
          value: txRecevied
        },
      });
    });
  });
}

export const getAddressBalances = (address: string) => {
  return new Promise(async(resolve, reject) => {
    const db = await getDbInstance();
    let ccIndex = [address];
    let docFilter = {
      $or: [
        {
          from: address,  
        },
        {
          to: address,  
        }
      ]
    };

    if (address[0] === 'R') {
      const ccIndexRes = await getCCIndexKeys(address);
      log('R-address');

      if (ccIndexRes) {
        const {raddress, cindex1, cindex2} = ccIndexRes;
        ccIndex = [cindex1, cindex2];
        docFilter = {
          $or: [
            {
              from: cindex1,  
            },
            {
              to: cindex1,  
            },
            {
              from: cindex2,  
            },
            {
              to: cindex2,  
            }
          ]
        };
      }
    }

    log(ccIndex);

    const docCount = await db.collection('transactions').countDocuments(docFilter);

    log('total txs', docCount);
    
    db.collection('transactions')
    .find(
      docFilter,
      {projection:{_id:0}}
    )
    .toArray((err, result) => {
      if (err) throw err;
      let balances = {};

      for (let i = 0; i < result.length; i++) {
        if (result[i].from && ccIndex.indexOf(result[i].from) > -1 && result[i].value) {
          if (!balances.hasOwnProperty(result[i].tokenid)) balances[result[i].tokenid] = 0;
          balances[result[i].tokenid] -= result[i].value;
        }

        if (result[i].to && ccIndex.indexOf(result[i].to) > -1 && result[i].value) {
          if (!balances.hasOwnProperty(result[i].tokenid)) balances[result[i].tokenid] = 0;
          balances[result[i].tokenid] += result[i].value;
        }
      }

      resolve(Object.keys(balances).length ? Object.entries(balances) : null);
    });
  });
}