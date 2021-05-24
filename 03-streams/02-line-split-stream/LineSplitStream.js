const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.buffer = ''
  }

  _transform(chunk, encoding, callback) {
    const arrStrings = chunk.toString().split(os.EOL)
    if (arrStrings.length > 1) {
      this.push(this.buffer + arrStrings[0])
      this.buffer = arrStrings[arrStrings.length - 1]
      arrStrings.slice(1, -1).forEach((x) => {
        this.push(x)

      })
    } else {
      this.buffer = this.buffer + arrStrings[0]
    }
    callback()
  }

  _flush(callback) { 
    callback(null, this.buffer);
  }
}

module.exports = LineSplitStream;
