import {getAddressBalances} from '../../helpers/db.balance';
import {getTokenInfo} from '../../helpers/db.tokens';

export default async (req, res) => {
  const {address} = req.query;

  if (address) {
    let doc = await getAddressBalances(address);

    if (doc) {
      if (doc.length) {
        for (let i = 0; i < doc.length; i++) {
          const tokenInfo = await getTokenInfo(doc[i][0]);
          doc[i].push(tokenInfo);
        }
      }

      res
        .status(200)
        .json(doc);
    } else {
      res
        .status(404)
        .json({error: 'no balances information available for this address'});
    }
  } else {
    res
      .status(404)
      .json({error: 'tokenId or address param is missing'});
  }
}