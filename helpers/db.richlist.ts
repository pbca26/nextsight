import getDbInstance from './db';
import paginate from './paginate';
import log from './logger';

const MAX_ITEMS_PER_PAGE = 50;

export const getTokenRichlist = (tokenId: string, page: number = 1) => {
  return new Promise(async(resolve, reject) => {
    const db = await getDbInstance();
    const docFilter = {
      tokenid: tokenId
    };

    log(tokenId);

    const docCount = await db.collection('transactions').countDocuments(docFilter);

    log('total txs', docCount);
    
    db.collection('transactions')
    .find(
      docFilter,
      {projection:{_id:0}}
    )
    .toArray((err, result) => {
      if (err) throw err;
      const addresses = {};

      for (let i = 0; i < result.length; i++) {
        if (result[i].from && result[i].value) {
          if (!addresses.hasOwnProperty(result[i].from)) addresses[result[i].from] = 0;
          addresses[result[i].from] -= result[i].value;
        }

        if (result[i].to && result[i].value) {
          if (!addresses.hasOwnProperty(result[i].to)) addresses[result[i].to] = 0;
          addresses[result[i].to] += result[i].value;
        }
      }

      resolve(Object.entries(addresses));
    });
  });
}