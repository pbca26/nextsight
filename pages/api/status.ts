import getDbInstance from '../../helpers/db';

export default async (req, res) => {
  const db = await getDbInstance();
  const doc = await db.collection('status').findOne();

  res.json({
    current: doc.lastBlockChecked,
    tip: doc.tip,
  });
}