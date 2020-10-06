`use strict`

import fs from `fs`;
import zmq from `zeromq`;
import filename from process.argv[2];

// Create the pub/publisher endpoint.
const publisher = zmq.Socket(`pub`);

fs.watch(filename, () => {
  // Send a message to any and all subscribers.
  publisher.send(JSON.stringify({
    type: `changed`,
    file: filename,
    timestamp: Date.now()
  }));
});