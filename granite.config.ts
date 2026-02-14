import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'dream-interpret',
  web: {
    host: '0.0.0.0',
    port: 3030,
    commands: {
      dev: 'rsbuild dev',
      build: 'rsbuild build',
    },
  },
  permissions: [],
  outdir: 'dist',
  brand: {
    displayName: '간밤의 꿈',
    icon: 'https://raw.githubusercontent.com/jino123413/app-logos/master/dream-interpret.png',
    primaryColor: '#1A1B4B',
    bridgeColorMode: 'basic',
  },
  webViewProps: {
    type: 'partner',
  },
});
