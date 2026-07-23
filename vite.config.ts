import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { handlePronounceEval, handleAITutor, handleDictionaryLookup } from './src/server/apiHandler';

function apiServerPlugin(): Plugin {
  return {
    name: 'api-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();

        let bodyStr = '';
        req.on('data', (chunk) => { bodyStr += chunk; });
        req.on('end', async () => {
          try {
            const body = bodyStr ? JSON.parse(bodyStr) : {};
            res.setHeader('Content-Type', 'application/json');

            if (req.url === '/api/pronounce-eval') {
              const data = await handlePronounceEval(body);
              res.end(JSON.stringify(data || { error: 'Fallback to client' }));
            } else if (req.url === '/api/ai-tutor') {
              const data = await handleAITutor(body);
              res.end(JSON.stringify(data || { error: 'Fallback to client' }));
            } else if (req.url === '/api/dictionary-lookup') {
              const data = await handleDictionaryLookup(body);
              res.end(JSON.stringify(data || { error: 'Fallback to client' }));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Not found' }));
            }
          } catch (err: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
