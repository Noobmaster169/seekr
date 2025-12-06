# Shop Components Documentation

## Overview

This plugin includes three interactive shopping components that demonstrate a complete product selection and purchase workflow.

## Components

### 1. ItemCarousel (`ItemCarousel.jsx`)

**Purpose**: Display a carousel of products for users to browse and select.

**Features**:
- 🎠 Smooth carousel navigation with prev/next buttons
- 🖼️ Product image display with fallback for missing images
- 💰 Price display
- 📊 Visual progress indicators (dots)
- 🎯 Click-to-select functionality
- ✨ Smooth animations with Framer Motion

**Props**:
```javascript
{
  products: Array,        // Array of product objects
  onSelectProduct: Function  // Callback when user selects a product
}
```

**Product Object Structure**:
```javascript
{
  id: Number,
  title: String,
  price: Number,
  image: String,          // URL to product image
  description: String,    // Optional
  colors: Array,          // Optional, defaults provided
  sizes: Array           // Optional, defaults provided
}
```

---

### 2. ItemSelection (`ItemSelection.jsx`)

**Purpose**: Allow users to customize their product selection (color, size, quantity).

**Features**:
- 🎨 Color picker with visual color swatches
- 📏 Size selection buttons
- 🔢 Quantity adjustment (+/- buttons)
- ✅ Visual feedback for selected options
- ℹ️ Informational notes
- 🔙 Back navigation
- 🚫 Validation (disabled confirm until color & size selected)

**Props**:
```javascript
{
  product: Object,        // Selected product from carousel
  onConfirm: Function,    // Callback with selection details
  onBack: Function       // Callback to return to carousel
}
```

**Selection Output**:
```javascript
{
  product: Object,
  color: { name: String, hex: String },
  size: String,
  quantity: Number
}
```

---

### 3. ItemConfirmation (`ItemConfirmation.jsx`)

**Purpose**: Display order summary and confirm purchase.

**Features**:
- ✅ Success icon animation
- 🛍️ Product summary card
- 📋 Selected options display (color, size, quantity)
- 💵 Price breakdown and total
- 📦 Order information
- 🔗 Redirect to store button
- 🔙 Back navigation

**Props**:
```javascript
{
  selection: Object,      // Complete selection from ItemSelection
  onConfirm: Function,    // Final confirmation callback
  onBack: Function       // Callback to return to selection
}
```

---

## Demo Component (`ShopDemo.jsx`)

**Purpose**: Orchestrate the complete shopping workflow.

**Features**:
- 🔄 State management for the entire flow
- 📍 Progress indicator showing current step
- 🎬 Smooth view transitions
- 🎨 Sample product data included
- 🔁 Reset flow after completion

**Workflow**:
1. **Carousel** → User browses and selects product
2. **Selection** → User customizes color, size, quantity
3. **Confirmation** → User reviews and confirms purchase
4. **Redirect** → Simulates redirect to actual store

---

## Integration

The Shop Demo has been integrated into the main overlay as a new tab:

### In `OverlayApp.jsx`:
```javascript
import ShopDemo from './components/ShopDemo'

// Added to tabs array:
{ id: 'shop', icon: ShoppingBag, label: 'Shop Demo' }

// In tab content:
{activeTab === 'shop' && <ShopDemo />}
```

---

## Usage

### Access the Shop Demo:
1. Open the plugin overlay (Alt+L or click extension icon)
2. Click the "Shop Demo" tab
3. Browse products using carousel arrows
4. Click "Select This Product" or click on centered product
5. Choose color, size, and quantity
6. Review your selection
7. Confirm to simulate store redirect

---

## Customization

### Adding Real Products:
Replace the `demoProducts` array in `ShopDemo.jsx` with your actual product data:

```javascript
const products = [
  {
    id: 1,
    title: 'Your Product',
    price: 99.99,
    image: 'https://your-image-url.com/image.jpg',
    description: 'Product description',
    colors: [
      { name: 'Color Name', hex: '#HEX_CODE' }
    ],
    sizes: ['S', 'M', 'L']
  }
];
```

### Connecting to Real API:
Replace the `handleFinalConfirm` function in `ShopDemo.jsx` to:
- Send data to your backend
- Redirect to actual product pages
- Track analytics
- Add to cart functionality

### Styling:
All components use TailwindCSS with glassmorphism effects. Modify classes to match your brand:
- Primary color: Purple/Blue gradient (`from-purple-500 to-blue-500`)
- Glass effects: `backdrop-blur-xl bg-white/10`
- Borders: `border-white/20`

---

## Technical Details

### Dependencies:
- React 18.2.0
- Framer Motion 10.16.4
- Lucide React 0.292.0
- TailwindCSS 3.3.5

### Key Features:
- ✅ Fully responsive design
- ✅ Smooth animations and transitions
- ✅ Error handling for missing images
- ✅ Input validation
- ✅ Accessible UI elements
- ✅ Clean, modular architecture

---

## Future Enhancements

Potential improvements:
- [ ] Real-time inventory checking
- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Image zoom/gallery
- [ ] Size guide modal
- [ ] Recently viewed products
- [ ] Product recommendations
- [ ] Shopping cart integration
- [ ] Payment processing
- [ ] Order tracking

---

## Browser Extension Integration

These components work seamlessly with the browser extension's content script system. To interact with actual web pages:

1. Use the message passing system in `content.js`
2. Send product selection data to background script
3. Inject data into target website forms
4. Automate checkout process

See the main documentation for more details on DOM manipulation and page interaction.
