process.env.DISABLE_HMR = 'true';

import express from 'express';
import { createServer as createViteServer } from 'vite';
import apiRouter from './server/routes/api.js';
import { seedDatabase } from './server/db/seed.js';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // JSON request body parser
  app.use(express.json());

  // Mount REST API routes
  app.use('/api', apiRouter);

  // Seed default competition and users
  try {
    await seedDatabase();
  } catch (err) {
    console.error('[Seed Error]:', err);
  }

  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  } else {
    // Vite SPA middleware for frontend
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Feedants Backend] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Error]:', err);
  process.exit(1);
});
