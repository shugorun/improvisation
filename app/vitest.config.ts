import { defineConfig } from 'vitest/config'

// Tests are pure logic (.test.ts), so no Vite plugins are needed here.
// Kept separate from vite.config.ts to avoid the nested-vite type clash.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
