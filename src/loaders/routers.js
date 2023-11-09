const indexRouter = require("../routes/index");
const authRouter = require("../routes/auth");
const userRouter = require("../routes/users");

async function routerLoader(app) {
  app.use("/", indexRouter);
  app.use("/auth", authRouter);
  app.use("/users", userRouter);
}

module.exports = routerLoader;
