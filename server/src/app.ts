import express from 'express';
import cors from 'cors';
import { db } from '../prisma/db.js';
import { authMiddleware } from './middleware/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'up' });
});

app.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await db.orm.public.User.all();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default app;
