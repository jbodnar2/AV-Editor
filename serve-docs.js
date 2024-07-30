import liveServer from "live-server";

liveServer.start({
  port: 3000,
  host: "localhost",
  root: "docs",
  open: true,
  wait: 500,
  noCssInjection: true,
  mount: [
    // ["/endpoint", "path"],
    // ["/a", "www/a"],
  ],

  logLevel: 2,
  middleware: [
    function (req, res, next) {
      next();
    },
  ],
});
