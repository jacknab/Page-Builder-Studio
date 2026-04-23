import { createServer } from "http";
import { request as httpRequest } from "http";

const TARGET_PORT = 5000;
const LISTEN_PORT = 23795;

createServer((req, res) => {
  const options = {
    hostname: "127.0.0.1",
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `localhost:${TARGET_PORT}` },
  };
  const proxy = httpRequest(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });
  proxy.on("error", () => res.writeHead(502).end("Bad Gateway"));
  req.pipe(proxy, { end: true });
}).listen(LISTEN_PORT, "0.0.0.0", () => {
  console.log(`Proxy: ${LISTEN_PORT} → ${TARGET_PORT}`);
});
