import {getAddressBalance} from '../../helpers/db.balance';

export default async (req, res) => {
  const {tokenId, address} = req.query;

  if (tokenId && address) {
    const doc = await getAddressBalance(tokenId, address);

    if (doc) {
      res
        .status(200)
        .json(doc);
    } else {
      res
        .status(404)
        .json({error: 'no balance information available for address/token'});
    }
  } else {
    res
      .status(404)
      .json({error: 'tokenId or address param is missing'});
  }
}