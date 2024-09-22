import { handler } from './build/handler.js';
import express from 'express';

const app = express();

// Increase the payload size limit to 10MB (adjust as needed)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Let SvelteKit handle everything else
app.use(handler);

const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
