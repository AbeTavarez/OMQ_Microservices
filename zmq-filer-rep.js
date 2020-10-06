`use strict`;

const fs = require(`fs`);
const zmq = require(`zeromq`);

//* Responder /////////////////////

// Socket to Reply to client requests
const responder = zmq.socket(`rep`);

// handle incoming requests
responder.on(`message`, (data) => {
  // Parse the incoming message
  const request = JSON.parse(data);
  console.log(`Recieved request to get: ${request.path}`);

  // Read the file and reply with content
  fs.readFile(request.path, (err, content) => {
    console.log(`Sending response content...`);
    responder.send(
      JSON.stringify({
        content: content.toString(),
        timestamp: Date.now(),
        pid: process.pid,
      })
    );
  });
});

// Listen on TCP port 60401
const PORT = `60401`;
responder.bind(`tcp://127.0.0.1:${PORT}`, (err) => {
  console.log(`Listemimg for zmq requesters on port ${PORT}...`);
});

// Close the responder when the Node process ends
process.on(`SIGINT`, () => {
  console.log(`Shuttin down...`);
  responder.close();
});
