const authRouter = require("../routes/auth");
const userRouter = require("../routes/users");

async function routerLoader(app) {
  app.use("/auth", authRouter);
  app.use("/users", userRouter);
}

module.exports = routerLoader;
