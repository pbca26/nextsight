import clientPromise from '../lib/mongodb';

const getDbInstance = async() => {
  const client = await clientPromise;

  const db = client.db(process.env.MONGODB_NAME);

  return db;
};

export default getDbInstance;