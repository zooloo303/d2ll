import { handler } from './build/handler.js';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();

// Increase the payload size limit to 10MB (adjust as needed)
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    body: req.body
  });
  res.status(500).send('Something broke!');
});

// Let SvelteKit handle everything else
app.use(handler);

const port = 10000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
