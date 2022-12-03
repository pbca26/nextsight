import {getTokenOrders, getOrders} from '../../helpers/db.orders';
import {getTokenInfo} from '../../helpers/db.tokens';

export default async (req, res) => {
  const {page, tokenId} = req.query;

  if (tokenId) {
    const doc = await getTokenOrders(tokenId, page);

    if (doc) {
      for (let i = 0; i < doc.length; i++) {
        const tokenInfo = await getTokenInfo(doc[i].tokenId);
        doc[i].tokenInfo = tokenInfo;
      }

      res
        .status(200)
        .json(doc);
    } else {
      res
        .status(404)
        .json({error: 'no orders for this token'});
    }
  } else {
    const doc = await getOrders(page);

    if (doc && doc.length > 0) {
      for (let i = 0; i < doc.length; i++) {
        const tokenInfo = await getTokenInfo(doc[i].tokenid);
        doc[i].tokenInfo = tokenInfo;
      }

      res
        .status(200)
        .json(doc);
    } else {
      res
        .status(404)
        .json({error: 'no orders'});
    }
  }
}