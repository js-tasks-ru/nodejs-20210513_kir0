const url = require('url');
const http = require('http');
const path = require('path');
const LimitSizeStream = require('./LimitSizeStream');
const { createWriteStream, unlink, WriteStream } = require('fs');
const server = new http.Server();


server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

/* ничего не пойму в порядке работы здесь
ошибки выдает, то в одном тесте валится, то в другом. 
связи уже не вижу


не очень хорошо понимаю как работают потоки в http из-за 
этого дальше не могу продвинуться
*/




  switch (req.method) {
    case 'POST':


      if (pathname.includes('/')) {
        res.writeHead(400, 'Not allowed')
        res.end()
        return
      }
      const limitStream = new LimitSizeStream({ limit: 1024 * 1024 });

      const writeStream = createWriteStream(filepath, { flags: 'wx' })

      req.pipe(limitStream).pipe(writeStream)



      limitStream.on('error', err => {
        if (err.code === 'LIMIT_EXCEEDED') {
          /* delete current file if limit overflows */

          unlink(filepath, () => {
          })
          writeStream.close();
          res.statusCode = 413;
          res.end(err.message)
        } else {
          res.statusCode = 500
          res.end(err.message)
        }
      })

      writeStream.on('error', err => {
        writeStream.close()
        if (err.code === 'EEXIST') {
          res.statusCode = 409
          res.end('File allready exist')
        }
      })


      req.on('close', () => {
        if (!writeStream.writableFinished) {
          unlink(filepath, () => {
            writeStream.close();
          });

        }
      });

      writeStream.on('finish', () => {
        res.statusCode = 201
        res.end('success')
      })


      req.on('aborted', () => {
        unlink(filepath, (err) => { })
        writeStream.destroy()
      })

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
