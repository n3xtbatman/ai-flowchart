const react = require('@vitejs/plugin-react');
const { defineConfig } = require('vite');

module.exports = defineConfig({
  base: '/ai-flowchart/', // 👈 This is key!
  plugins: [react()],
});
