const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>CodeCraftHub is Working!</h1><p>First server by Jassim</p>');
});

server.listen(3000, () => {
  console.log('Running on http://localhost:3000');
});