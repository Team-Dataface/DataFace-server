const indexRouter = require("../routes/index");

function routerLoader(app) {
  app.use("/", indexRouter);
}

module.exports = routerLoader;
