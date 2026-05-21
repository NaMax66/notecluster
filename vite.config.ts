import path from 'path';
import { execSync } from 'node:child_process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function readGitValue(command: string) {
  try {
    return execSync(command, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
}

const commitSha = (process.env.CF_PAGES_COMMIT_SHA || readGitValue('git rev-parse HEAD')).slice(0, 8);

export default defineConfig({
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://127.0.0.1:8787',
            changeOrigin: true,
            secure: false,
          },
        },
      },
      define: {
        __APP_VERSION__: JSON.stringify(commitSha || 'dev'),
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
});
