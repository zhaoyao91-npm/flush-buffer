const EventEmitter = require("events");

const { FLUSH, ERROR } = require("./events");
const { SimpleBuffer } = require("./buffers");

class FlushBuffer extends EventEmitter {
  constructor({
    flushInterval = 1000,
    maxSize = 1,
    buffer = new SimpleBuffer()
  } = {}) {
    super();
    this.flushInterval = flushInterval;
    this.maxSize = maxSize;
    this.buffer = buffer;
    this.timer = null;
  }

  start() {
    this.stop();
    this.timer = setInterval(this.flush.bind(this), this.flushInterval);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
  }

  push(item) {
    this.buffer.push(item);
    if (this.buffer.size() >= this.maxSize) {
      this.flush();
    }
  }

  flush() {
    if (this.buffer.size() > 0) {
      const items = this.buffer.rotate();
      try {
        this.emit(FLUSH, items);
      } catch (error) {
        this.emit(ERROR, error);
      }
    }
  }
}

module.exports = FlushBuffer;
