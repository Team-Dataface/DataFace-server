const indexRouter = require("../routes/index");
const authRouter = require("../routes/auth");
const databaseRouter = require("../routes/databases");

async function routerLoader(app) {
  app.use("/", indexRouter);
  app.use("/auth", authRouter);
  app.use("/users/:userid/databases", databaseRouter);
}

module.exports = routerLoader;
