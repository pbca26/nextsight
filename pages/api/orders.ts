import {getOrders} from '../../helpers/db.orders';
import {getTokenInfo} from '../../helpers/db.tokens';

export default async (req, res) => {
  const {page} = req.query;

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