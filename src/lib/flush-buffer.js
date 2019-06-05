const EventEmitter = require("events");

const { FLUSH, ERROR } = require("./events");
const { SimpleBuffer } = require("./buffers");

class FlushBuffer extends EventEmitter {
  constructor({ flushInterval, maxSize, buffer = new SimpleBuffer() } = {}) {
    if (!(flushInterval > 0)) {
      throw new Error("`flushInterval` must be a positive number.");
    }
    if (!(maxSize > 0)) {
      throw new new Error("`maxSize` must be a positive number.")();
    }

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
