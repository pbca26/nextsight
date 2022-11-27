import {getTokenRichlist} from '../../helpers/db.richlist';

export default async (req, res) => {
  const {tokenId} = req.query;

  if (tokenId) {
    const doc = await getTokenRichlist(tokenId);

    if (doc) {
      res
        .status(200)
        .json(doc);
    } else {
      res
        .status(404)
        .json({error: 'no richlist for this token'});
    }
  } else {
    res
      .status(404)
      .json({error: 'tokenId param is missing'});
  }
}