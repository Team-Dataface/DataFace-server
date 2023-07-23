const indexRouter = require("../routes/index");
const authRouter = require("../routes/auth");
const databaseRouter = require("../routes/users");

async function routerLoader(app) {
  app.use("/", indexRouter);
  app.use("/auth", authRouter);
  app.use("/users", databaseRouter);
}

module.exports = routerLoader;
