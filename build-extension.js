import { build } from 'vite'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function buildExtension() {
  console.log('🔨 Building Liquid Glass Browser Extension...\n')

  // Build the overlay
  console.log('📦 Building overlay bundle...')
  await build({
    configFile: false,
    define: {
      'process.env': {},
      'global': 'window'
    },
    build: {
      rollupOptions: {
        input: {
          overlay: resolve(__dirname, 'src/overlay.jsx')
        },
        output: {
          entryFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]',
          format: 'iife'
        }
      },
      outDir: 'dist',
      emptyOutDir: false,
      minify: false
    }
  })

  // Copy public files
  console.log('📋 Copying extension files...')
  const publicDir = resolve(__dirname, 'public')
  const distDir = resolve(__dirname, 'dist')

  const filesToCopy = [
    'manifest.json',
    'popup.html',
    'popup.js',
    'content.js',
    'content.css'
  ]

  filesToCopy.forEach(file => {
    const src = path.join(publicDir, file)
    const dest = path.join(distDir, file)
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest)
      console.log(`  ✓ ${file}`)
    }
  })

  // Copy/create icons
  console.log('\n🎨 Setting up icons...')
  const iconSizes = [16, 48, 128]
  iconSizes.forEach(size => {
    const iconPath = path.join(distDir, `icon${size}.png`)
    if (!fs.existsSync(iconPath)) {
      // Create a placeholder SVG icon and save message
      console.log(`  ⚠️  icon${size}.png not found - please add icons to public/ folder`)
    }
  })

  console.log('\n✨ Extension built successfully!')
  console.log('📁 Output directory: dist/')
  console.log('\n🚀 To load the extension:')
  console.log('  1. Open Chrome/Edge and go to chrome://extensions/')
  console.log('  2. Enable "Developer mode"')
  console.log('  3. Click "Load unpacked"')
  console.log('  4. Select the "dist" folder')
  console.log('\n💡 Press Alt+L on any website to toggle the overlay!')
}

buildExtension().catch(console.error)
