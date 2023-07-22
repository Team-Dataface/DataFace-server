const indexRouter = require("../routes/index");
const authRouter = require("../routes/auth");

async function routerLoader(app) {
  app.use("/", indexRouter);
  app.use("/auth", authRouter);
}

module.exports = routerLoader;
