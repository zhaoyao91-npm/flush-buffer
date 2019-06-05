class SimpleBuffer {
  constructor() {
    this._buffer = [];
  }

  rotate() {
    const buffer = this._buffer;
    this._buffer = [];
    return buffer;
  }

  push(item) {
    this._buffer.push(item);
  }

  size() {
    return this._buffer.length;
  }
}

class UniqueBuffer {
  constructor() {
    this._buffer = new Set();
  }

  rotate() {
    const buffer = Array.from(this._buffer);
    this._buffer.clear();
    return buffer;
  }

  push(item) {
    this._buffer.add(item);
  }

  size() {
    return this._buffer.size;
  }
}

module.exports = {
  SimpleBuffer,
  UniqueBuffer
};
