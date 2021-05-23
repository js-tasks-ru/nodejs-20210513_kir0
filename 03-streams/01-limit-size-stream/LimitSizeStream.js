const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  limit = 0;
  total = 0;
  constructor(options) {
    super(options);
    this.limit = options.limit;
  }

 

  _transform(chunk, encoding, next) {
    let data;
    let error;
    try {
      this.total += chunk.length
      if (this.total > this.limit) throw new LimitExceededError()

      data = chunk.toString();
    } catch (e) {
      error = e;
    }
    next(error, data);
  }
}

module.exports = LimitSizeStream;
