import { build } from 'vite'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function buildExtension() {
  console.log('🔨 Building Seekr Extension...\n')

  const distDir = resolve(__dirname, 'dist')
  
  // Clear dist directory first to avoid caching issues
  if (fs.existsSync(distDir)) {
    console.log('🧹 Cleaning dist directory...')
    const files = fs.readdirSync(distDir)
    files.forEach(file => {
      const filePath = path.join(distDir, file)
      const stat = fs.statSync(filePath)
      if (stat.isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true })
      } else {
        fs.unlinkSync(filePath)
      }
    })
  } else {
    fs.mkdirSync(distDir, { recursive: true })
  }

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
      emptyOutDir: true,
      minify: false
    }
  })

  // Copy public files
  console.log('📋 Copying extension files...')
  const publicDir = resolve(__dirname, 'public')

  const filesToCopy = [
    'manifest.json',
    'popup.html',
    'popup.js',
    'background.js',
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
  console.log('\n🔑 Don\'t forget to configure your Claude API key in the extension popup!')
}

buildExtension().catch(console.error)
