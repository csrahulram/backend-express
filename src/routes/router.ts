import express, { Request, Response } from 'express';
import { moduleHandler } from '../controllers/module';

const router = express.Router();



router.all('/api/:module', moduleHandler);

// Export the router
export default router;