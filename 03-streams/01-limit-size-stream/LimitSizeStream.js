const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  total = 0
  limit = 0
  constructor(options) {
    super(options);
    this.limit = options.limit

  }

  _transform(chunk, encoding, callback) {

    let err = null
    this.total += chunk.length

    if (this.total >= this.limit) {
      console.log(this.total, this.limit);
      err = new LimitExceededError()
    }
    callback(err, chunk)
  }

  _flush(cb) {
    cb()
  }
}

module.exports = LimitSizeStream;
