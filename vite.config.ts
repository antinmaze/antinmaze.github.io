import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import { localizeEnglish } from './lib/localize';

function englishPage(): Plugin {
  return {
    name: 'static-english-page',
    enforce: 'post',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = request.url?.split('?')[0];
        if (pathname === '/en') {
          response.writeHead(302, { Location: `/en/${request.url?.includes('?') ? `?${request.url.split('?')[1]}` : ''}` });
          response.end();
          return;
        }
        if (pathname !== '/en/' && pathname !== '/en/index.html') return next();
        try {
          const template = await readFile(fileURLToPath(new URL('./index.html', import.meta.url)), 'utf8');
          const html = await server.transformIndexHtml('/en/', localizeEnglish(template));
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.end(html);
        } catch (error) { next(error); }
      });
    },
    generateBundle(_options, bundle) {
      const page = bundle['index.html'];
      if (page?.type !== 'asset' || typeof page.source !== 'string') throw new Error('French HTML missing from build');
      this.emitFile({ type: 'asset', fileName: 'en/index.html', source: localizeEnglish(page.source) });
    },
  };
}

export default defineConfig({ plugins: [englishPage()] });