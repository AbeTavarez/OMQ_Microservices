`use strict`;

//* Publisher /////////////////////

const fs = require(`fs`);
const zmq = require(`zeromq`);
const filename = process.argv[2];

// Other files
const secTarget = __dirname + `/secTarget.txt`;

// Create the pub/publisher endpoint.
const publisher = zmq.socket('pub');

// fs.watch is only called once
fs.watch(secTarget, () => {
  // Send a message to any and all subscribers.
  publisher.send(
    JSON.stringify({
      type: `changed`,
      file: filename,
      timestamp: Date.now(),
    })
  );
});

// Listen on TCP port 60400
publisher.bind(`tcp://*:60400`, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening for zmq subscribers...`);
});
