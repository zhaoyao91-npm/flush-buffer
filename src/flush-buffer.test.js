const tap = require("tap");
const sleep = require("@zhaoyao91/async-sleep");

const FlushBuffer = require("./flush-buffer");

tap.test("flushBuffer with maxSize", t => {
  const buffer = new FlushBuffer({ maxSize: 2 });
  const events = [];

  buffer.on(FlushBuffer.EVENT_FLUSH, items => {
    events.push(`items: ${items}`);
  });

  buffer.push(1);
  events.push("1 pushed");

  buffer.push(2);
  events.push("2 pushed");

  buffer.push(3);
  events.push("3 pushed");

  t.strictSame(events, ["1 pushed", "items: 1,2", "2 pushed", "3 pushed"]);

  t.done();
});

tap.test("flushBuffer with flushInterval", async t => {
  const buffer = new FlushBuffer({ flushInterval: 100, maxSize: 2 });
  const events = [];

  buffer.on(FlushBuffer.EVENT_FLUSH, items => {
    events.push(`items: ${items}`);
  });

  buffer.start();

  buffer.push(1);

  t.strictSame(events, []);

  await sleep(90);

  t.strictSame(events, []);

  await sleep(10);

  t.strictSame(events, ["items: 1"]);

  buffer.stop();

  buffer.push(2);

  await sleep(200);

  t.strictSame(events, ["items: 1"]);
});

tap.test("flushBuffer with error listener", t => {
  const buffer = new FlushBuffer({ maxSize: 1 });

  buffer.on(FlushBuffer.EVENT_FLUSH, items => {
    throw new Error(`Oops ${items}`);
  });

  buffer.on(FlushBuffer.EVENT_ERROR, error => {
    t.match(error, { message: "Oops 1" });
    t.done();
  });

  buffer.push(1);
});
