import path  from 'path'
import { defineConfig } from 'vite'

const config = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'upload.js'),
      name: 'upload',
      fileName: 'upload',
      formats: ['es'],
    },
  }
});

export default config;
