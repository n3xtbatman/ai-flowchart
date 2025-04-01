const react = require('@vitejs/plugin-react');
const { defineConfig } = require('vite');

module.exports = defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs'
  }
});
