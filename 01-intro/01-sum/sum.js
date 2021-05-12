function sum(...rest) {
  if (rest.some(x => typeof x !== "number")) {
    throw new TypeError()
  }
  return rest.reduce((a, i) => a += i, 0)
}

module.exports = sum;
