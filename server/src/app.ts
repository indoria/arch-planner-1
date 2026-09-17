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

app.get('/architectures/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const arch = await db.orm.public.Architecture.where({ id: Number(id) }).first();

    if (!arch) {
      res.status(404).json({ error: 'Architecture not found' });
      return;
    }

    if (arch.ownerId !== user.id && !arch.isPublic) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    res.status(200).json(arch);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/architectures/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const updateData = req.body;

    const arch = await db.orm.public.Architecture.where({ id: Number(id) }).first();

    if (!arch) {
      res.status(404).json({ error: 'Architecture not found' });
      return;
    }

    if (arch.ownerId !== user.id) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const updatedArch = await db.orm.public.Architecture.update({
      where: { id: Number(id) },
      data: updateData
    });

    res.status(200).json(updatedArch);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/architectures/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const arch = await db.orm.public.Architecture.where({ id: Number(id) }).first();

    if (!arch) {
      res.status(404).json({ error: 'Architecture not found' });
      return;
    }

    if (arch.ownerId !== user.id) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    await db.orm.public.Architecture.delete({
      where: { id: Number(id) }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default app;
