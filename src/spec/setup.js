const { MongoClient } = require("mongodb");
const CONFIG = require("../constants/config");

module.exports = {
  setupDB() {
    let connection;
    let db;

    beforeAll(async () => {
      connection = await MongoClient.connect(CONFIG.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      db = await connection.db();
    });

    afterAll(async () => {
      await connection.close();
      await db.collection("test").deleteMany({});
    });
  },
};
