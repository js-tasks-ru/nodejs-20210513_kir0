const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs')

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if(/\//.test(pathname)){
        res.writeHead(400, 'no nesting')
        res.end()
      }
      fs.readFile(filepath, (err, file) => {
        if (err) {
         // console.log('нету файла', err);
          res.writeHead(404, 'file doesnt exist')
          res.end()
        } else {
          //console.log('файл');
          res.writeHead(200);

          res.write(file)
          res.end()
        }


      })


      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
