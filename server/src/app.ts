import express from 'express';
import cors from 'cors';
import { db } from '../prisma/db.js';
import { authMiddleware } from './middleware/auth.js';
import { validateArchitectureDefinition } from './validation.js';

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

app.get('/architectures', authMiddleware, async (req, res) => {
  try {
    const architectures = await db.orm.public.Architecture.all();
    res.status(200).json(architectures);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch architectures' });
  }
});

app.post('/architectures', authMiddleware, async (req, res) => {
  try {
    const user = (req as any).user;
    const { name, description, definition, isPublic } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    if (!definition) {
      res.status(400).json({ error: 'Definition is required' });
      return;
    }

    const validation = validateArchitectureDefinition(definition);
    if (!validation.valid) {
      res.status(400).json({ error: 'Invalid architecture schema', details: validation.errors });
      return;
    }

    const arch = await db.orm.public.Architecture.create({
      data: {
        name: name.trim(),
        description: description || null,
        definition,
        isPublic: Boolean(isPublic),
        ownerId: user.id
      }
    });

    res.status(201).json(arch);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
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

    if (updateData.definition) {
      const validation = validateArchitectureDefinition(updateData.definition);
      if (!validation.valid) {
        res.status(400).json({ error: 'Invalid architecture schema', details: validation.errors });
        return;
      }
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
