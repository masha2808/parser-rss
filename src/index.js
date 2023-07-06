const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const {	Worker, isMainThread } = require("worker_threads");
const apiRouter = require('./backend/src/routers/api-router');

const app = express();

const port = process.env.PORT || 4000;

app.use(express.json());

app.use('/api', apiRouter);
app.use('/', serveStatic(path.join(__dirname, '/frontend/build')));
app.get(/.*/, function (req, res) {
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}, http://localhost:${port}`);
  
  const __filename = "./backend/src/parser/parser.js";

  if (isMainThread) {
    const worker = new Worker(__filename);
    worker.postMessage('message');
    setInterval(() => {
      worker.postMessage('message');
    }, 300000);
  }  
});
