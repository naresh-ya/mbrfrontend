const https = require('https');
const fs = require('fs');
const next = require('next');

const port = 9006;

// ✅ Force external access
const hostname = '0.0.0.0';

const app = next({
  dev: false,
  hostname,
  port
});

const handle = app.getRequestHandler();

const options = {
  key: fs.readFileSync('C:/ssl/key.pem'),
  cert: fs.readFileSync('C:/ssl/cert.pem'),
};

app.prepare().then(() => {
  https.createServer(options, (req, res) => {
    handle(req, res);
  }).listen(port, '0.0.0.0', () => {
    console.log(`✅ HTTPS running on https://0.0.0.0:${port}`);
    console.log(`✅ Access via https://<EC2-IP>:${port}`);
  });
});