const url = require('url');
const http = require('http');
const path = require('path');
const LimitSizeStream = require('./LimitSizeStream');
const { createWriteStream, unlink, WriteStream } = require('fs');
const server = new http.Server();


server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);


  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.writeHead(400, 'Not allowed')
        res.end()
        break
      }
      const limitStream = new LimitSizeStream({ limit: 1024 * 1024 });

      const writeStream = createWriteStream(filepath, { flags: 'wx' })


      writeStream.on('finish', () => {
        res.statusCode = 201
        res.end('success')
      })

      req.pipe(limitStream).on('error', err => {
        unlink(filepath, () => {
        })
        res.statusCode = 413;
        res.end(err.message)
      }).pipe(writeStream).on('error', err => {

        if (err.code === 'EEXIST') {
          res.statusCode = 409
          res.end('File allready exist')
        } else {
          throw err
        }
      }) 


      req.on('aborted', () => {
        unlink(filepath, (err) => { })

        writeStream.destroy()
        res.end('aborted')
      })

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
