import getDbInstance from './db';
import paginate from './paginate';
import log from './logger';

const MAX_ITEMS_PER_PAGE = 50;

export const getTokens = (page: number = 1) => {
  return new Promise(async(resolve, reject) => {
    const db = await getDbInstance();

    const docCount = await db.collection('tokens').countDocuments();

    log('total tokens', docCount);
    const {total, current} = paginate(docCount, page, MAX_ITEMS_PER_PAGE);
    log(`from ${(current - 1) * MAX_ITEMS_PER_PAGE} to ${current * MAX_ITEMS_PER_PAGE}`);
    
    if (Number(current) !== Number(page)) {
      resolve([]);
    } else {
      db.collection('tokens')
      .find({}, {projection:{_id:0}})
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

export const getTokenInfo = (tokenId: string) => {
  return new Promise(async(resolve, reject) => {
    const db = await getDbInstance();

    db.collection('tokens')
      .findOne(
        {
          tokenid: tokenId,
        },
        {projection:{_id:0}},
        (err, result) => {
          if (err) throw err;
          //log(result);
          resolve(result);
        });
  });
};