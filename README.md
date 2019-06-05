# Flush Buffer

Auto flush buffer.

## Install

```bash
npm i @zhaoyao91/flush-buffer
```

## Usage

Simple case:

```js
const { FlushBuffer } = require("@zhaoyao91/flush-buffer");

const buffer = new FlushBuffer({
  flushInterval: 3000, // milliseconds
  maxSize: 5
});

buffer.on("flush", items => {
  // ...
});

buffer.on("error", error => {
  // ...
});

buffer.start();

buffer.push("some item");
buffer.push("some other item");

buffer.stop();
```

Use unique buffer:

```js
const { FlushBuffer, UniqueBuffer } = require("@zhaoyao91/flush-buffer");

const buffer = new FlushBuffer({
  // flushInterval: ...
  // maxSize: ...
  buffer: new UniqueBuffer()
});

// ...
```

## License

MIT
