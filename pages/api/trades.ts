import {getTokenDexTransactions} from '../../helpers/db.transactions';

export default async (req, res) => {
  const {page, tokenId} = req.query;

  if (tokenId) {
    const doc = await getTokenDexTransactions(tokenId, page);
    const stats = {
      count: 0,
      volume: 0,
    };

    if (doc) {
      for (let i = 0; i < doc.length; i++) {
        stats.count++;
        if (doc[i].value) stats.volume += doc[i].value;  
      }

      res
        .status(200)
        .json({
          stats,
          trades: doc
        });
    } else {
      res
        .status(404)
        .json({error: 'no trades history for this token'});
    }
  }
}