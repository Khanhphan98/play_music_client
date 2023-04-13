import { ConfigEnv, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { loadEnv } from 'vite';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { wrapperEnv } from './src/utils/ReadFileEnv';
export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();

  const env = loadEnv(mode, root);

  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env);

  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_DROP_CONSOLE } = viteEnv;
  return {
    base: VITE_PUBLIC_PATH,
    root,
    server: {
      https: false,
      // Listening on all local IPs
      host: true,
      port: VITE_PORT,
      //disable warning socket
      strictPort: true,
      hmr: { clientPort: VITE_PORT },
    },
    esbuild: {
      pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
    },
    build: {
      commonjsOptions: {
        include: ['tailwind.config.js', 'node_modules/**'],
      },
    },
    optimizeDeps: {
      include: ['tailwind-config'],
    },
    plugins: [
      vue(),
      VueI18nPlugin({
        include: [path.resolve(__dirname, './src/locales/**')],
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'tailwind-config': path.resolve(__dirname, './tailwind.config.js'),
      },
    },
  };
};
