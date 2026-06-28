import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/adhd-eeg-classification/',
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})