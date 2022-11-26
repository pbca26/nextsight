import getDbInstance from './db';
import log from './logger';

const getCCIndexKeys = (address: string) => {
  return new Promise(async(resolve, reject) => {
    const db = await getDbInstance();

    db.collection('ccIndex')
    .findOne(
      {
        $or: [
          {
            raddress: address,
          },
          {
            cindex1: address,
          },
          {
            cindex2: address,
          },
        ]
      },
      {projection:{_id:0}},
      (err, result) => {
        if (err) throw err;
        //log(result);
        resolve(result);
      });
  });
}

export default getCCIndexKeys;