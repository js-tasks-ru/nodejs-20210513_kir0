const url = require('url');
const http = require('http');
const path = require('path');
const { unlink } = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname.includes('/')) {
        res.writeHead(400, 'Not allowed')
        res.end()
        break
      }

      unlink(filepath, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            res.statusCode = 404
            res.end()
          } else {
            res.statusCode = 500
            res.end(err.message)
          }
        } else {
          res.statusCode = 200
          res.end('file has been deleted')
        }

      })
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
