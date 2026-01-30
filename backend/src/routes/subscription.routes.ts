import express from 'express'
import path from 'path';
import url from 'url';
import { verifyEmailToken } from '../middlewares/auth.middlewares.ts';
import { subscribe, unsubscribe } from '../controllers/subscription.controller.ts';

// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename)

const router = express.Router();

router.get('/subscribe', verifyEmailToken, subscribe);
router.get('/unsubscribe', verifyEmailToken ,unsubscribe);

router.get('/subscribed', (req, res) => res.sendFile(path.join(__dirname, '../public/sub.html'))) 
router.get('/unsubscribed', (req, res) => res.sendFile(path.join(__dirname, '../public/unsub.html')))


export default router;