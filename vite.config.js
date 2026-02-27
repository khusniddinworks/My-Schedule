import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    base: '/My-Schedule/', // GitHub Pages uchun repository nomi
    build: {
        chunkSizeWarningLimit: 1000,
    }
})
