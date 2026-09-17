import express from 'express';

// For now, we use a simple mock token check
// In a real scenario, this would verify a JWT from Supabase/Firebase
export const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (token === 'invalid-token') {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  // Attach user info to request (mocked for now)
  (req as any).user = { id: 1, email: 'test@example.com' };
  
  next();
};
