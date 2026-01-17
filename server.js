const express = require('express');
const app = express();

app.use(express.json());

let countdown = 60; // seconds
let interval = null;

// SSE endpoint
app.get('/countdown', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send immediately
  res.write(`data: ${countdown}\n\n`);

  const timer = setInterval(() => {
    if (countdown > 0) countdown--;
    res.write(`data: ${countdown}\n\n`);
  }, 1000);

  req.on('close', () => clearInterval(timer));
});

// Reset endpoint
app.post('/reset', (req, res) => {
  countdown = 60;
  res.send({ status: 'ok' });
});

app.listen(3000, () => console.log('SSE server running on port 3000'));
