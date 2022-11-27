const { createProxyMiddleware } = require("http-proxy-middleware");

const context = [
  "/weatherforecast",
  "/korisnik",
  "/api",
  "/api/Pitanja/promijeniPass",
  "/api/Pitanja/get",
  "/Logs/get",
];

module.exports = function (app) {
  const appProxy = createProxyMiddleware(context, {
    target: "https://localhost:5001",
    secure: false,
  });
  app.use(appProxy);
};
