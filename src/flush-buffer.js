const EventEmitter = require("events");

const events = require("./events");

class FlushBuffer extends EventEmitter {
  constructor({ flushInterval = 1000, maxSize = 1 } = {}) {
    super();
    this.flushInterval = flushInterval;
    this.maxSize = maxSize;
    this.buffer = [];
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
    if (this.buffer.length >= this.maxSize) {
      this.flush();
    }
  }

  flush() {
    if (this.buffer.length > 0) {
      const buffer = this.buffer;
      this.buffer = [];
      try {
        this.emit(events.FLUSH, buffer);
      } catch (error) {
        this.emit(events.ERROR, error);
      }
    }
  }
}

module.exports = FlushBuffer;
