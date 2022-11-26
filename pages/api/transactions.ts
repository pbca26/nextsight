import {
  getTokenTransactions,
  getTokenAddressTransactions,
  getTokenTransaction,
} from '../../helpers/db.transactions';

export default async (req, res) => {
  const {page, tokenId, address, txid} = req.query;

  if (tokenId && !address && !txid) {
    const doc = await getTokenTransactions(tokenId, page);

    if (doc) {
      res
        .status(200)
        .json(doc);
    } else {
      res
        .status(404)
        .json({error: 'no transactions history for this token'});
    }
  } else if (tokenId && address && !txid) {
    const doc = await getTokenAddressTransactions(tokenId, address, page);

    if (doc) {
      res
        .status(200)
        .json(doc);
    } else {
      res
        .status(404)
        .json({error: 'no transactions history for this address'});
    }
  } else if (tokenId && txid) {
    const doc = await getTokenTransaction(tokenId, txid);

    if (doc) {
      res
        .status(200)
        .json(doc);
    } else {
      res
        .status(404)
        .json({error: 'no such transactions exists in history'});
    }
  } else {
    res
      .status(404)
      .json({error: 'malformed request'});
  }
}