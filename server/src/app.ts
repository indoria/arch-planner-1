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

app.get('/architectures/share/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const arch = await db.orm.public.Architecture.where({ id: Number(id) }).first();

    if (!arch || !arch.isPublic) {
      res.status(404).json({ error: 'Architecture not found' });
      return;
    }

    res.status(200).json(arch);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/architectures/:id/share', authMiddleware, async (req, res) => {
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

    const updatedArch = await db.orm.public.Architecture.update({
      where: { id: Number(id) },
      data: { isPublic: true }
    });

    res.status(200).json({
      ...updatedArch,
      shareUrl: `/architectures/share/${id}`,
      isPublic: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/architectures/:id/clone', authMiddleware, async (req, res) => {
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

    const clonedName = req.body?.name || `${arch.name} (Clone)`;

    const clonedArch = await db.orm.public.Architecture.create({
      data: {
        name: clonedName,
        description: arch.description,
        definition: arch.definition,
        isPublic: false,
        ownerId: user.id
      }
    });

    res.status(201).json(clonedArch);
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

// Component Registry Endpoints

app.get('/components', authMiddleware, async (req, res) => {
  try {
    let components = await db.orm.public.Component.all();
    const { type, search } = req.query;

    if (type && typeof type === 'string') {
      components = components.filter((c: any) => c.type.toLowerCase() === type.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      components = components.filter((c: any) =>
        c.name.toLowerCase().includes(q) ||
        (c.data?.label && c.data.label.toLowerCase().includes(q)) ||
        (c.data?.description && c.data.description.toLowerCase().includes(q))
      );
    }

    res.status(200).json(components);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch components' });
  }
});

app.get('/components/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const component = await db.orm.public.Component.where({ id: Number(id) }).first();

    if (!component) {
      res.status(404).json({ error: 'Component not found' });
      return;
    }

    res.status(200).json(component);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/components', authMiddleware, async (req, res) => {
  try {
    const user = (req as any).user;
    const { name, type, data } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    if (!type || typeof type !== 'string' || type.trim() === '') {
      res.status(400).json({ error: 'Type is required' });
      return;
    }

    if (!data || typeof data !== 'object') {
      res.status(400).json({ error: 'Component data is required' });
      return;
    }

    const component = await db.orm.public.Component.create({
      data: {
        name: name.trim(),
        type: type.trim(),
        data,
        ownerId: user.id
      }
    });

    res.status(201).json(component);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/components/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const updateData = req.body;

    const component = await db.orm.public.Component.where({ id: Number(id) }).first();

    if (!component) {
      res.status(404).json({ error: 'Component not found' });
      return;
    }

    if (component.ownerId !== user.id) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const updated = await db.orm.public.Component.update({
      where: { id: Number(id) },
      data: updateData
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/components/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const component = await db.orm.public.Component.where({ id: Number(id) }).first();

    if (!component) {
      res.status(404).json({ error: 'Component not found' });
      return;
    }

    if (component.ownerId !== user.id) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    await db.orm.public.Component.delete({
      where: { id: Number(id) }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default app;
