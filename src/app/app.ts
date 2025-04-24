import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import router from '../routes/router';
import { createHandler } from 'graphql-http/lib/use/express';
import { schema } from '../schema/schema';

const DB_URL = process.env.DB_URL as string;
const CHAIN_CRT = process.env.CHAIN_CRT || '';
const KEY = process.env.KEY || '';
const PORT = 3000;

const app = express();

app.use(require('cors')());

app.use('/', router);



app.all('/graphql', createHandler({ schema }));

const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
    console.log('Server listerning', PORT)
});

if (CHAIN_CRT) {
    const certificate = fs.readFileSync(CHAIN_CRT, 'utf8');
    const privateKey = fs.readFileSync(KEY, 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(PORT + 443);
}

export default app;