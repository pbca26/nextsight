import getDbInstance from './db';
import paginate from './paginate';
import getCCIndexKeys from './db.ccindex';
import log from './logger';

const MAX_ITEMS_PER_PAGE = 50;

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