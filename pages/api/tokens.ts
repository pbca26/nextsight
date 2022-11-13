import {getTokens} from '../../helpers/db.tokens';

export default async (req, res) => {
  const {page} = req.query;

  if (page) {
    const doc = await getTokens(page);

    if (doc && doc.length > 0) {
      res
        .status(200)
        .json(doc);
    } else {
      res
        .status(404)
        .json({error: 'no tokens'});
    }
  } else {
    const doc = await getTokens();

    if (doc && doc.length > 0) {
      res
        .status(200)
        .json(doc);
    } else {
      res
        .status(404)
        .json({error: 'no tokens'});
    }
  }
}