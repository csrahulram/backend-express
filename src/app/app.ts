import dotenv from 'dotenv'
dotenv.config({ path: '.env.dev' });

import express, { Request, Response } from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import { createHandler } from 'graphql-http/lib/use/express';
import { root, schema } from '../schema/schema';
import mongoose from 'mongoose';

import passport from 'passport';

import googlePassport from 'passport-google-oauth20';



const DB_URL = process.env.DB_URL as string;
const CHAIN_CRT = process.env.CHAIN_CRT || '';
const KEY = process.env.KEY || '';
const PORT = 3000;

const GoogleStrategy = googlePassport.Strategy;

const app = express();

app.use(require('cors')());

// app.use(session())

app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/api/routes', (req, res) => {
    res.json([
        {
            "path": "list",
            "loadComponent": "ListComponent"
        }
    ]);
});

app.all('/graphql', createHandler({ schema, rootValue: root }));

const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
    console.log('Server listerning', PORT)
});

mongoose
    .connect(DB_URL)
    .then(
        async () => {
            console.log(DB_URL);
            console.log('Database connected successfully');
        },
        (err: any) => {
            console.log(err);
            console.log('Unable to connect database');
        },
    );

if (CHAIN_CRT) {
    const certificate = fs.readFileSync(CHAIN_CRT, 'utf8');
    const privateKey = fs.readFileSync(KEY, 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(PORT + 443);
}

export default app;