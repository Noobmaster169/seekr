# Chat Product Carousel Integration

## Overview

The ItemCarouselMini component provides a compact, chat-friendly product carousel that can be embedded directly within chat messages, appearing as part of the AI assistant's response.

## Component: ItemCarouselMini

### Visual Design

```
┌─────────────────────────────────────────────┐
│ 🛒 Product Selection          ● ○ ○         │
├─────────────────────────────────────────────┤
│ ┌────────────────────────────────────────┐  │
│ │ [img]  Premium Wireless Headphones     │  │
│ │ 80x80  High-quality audio...           │  │
│ │        $299.99          ● ○ ○          │  │
│ └────────────────────────────────────────┘  │
│                                             │
│  ◄  [  Select Product  ]  ►                │
│                                             │
│           1 of 3                            │
└─────────────────────────────────────────────┘
```

### Features

- **Compact Design**: Fits within chat message width (max 400px)
- **80x80px Product Image**: Square thumbnail with fallback
- **Product Info**: Title, description (truncated), and price
- **Color Preview**: Shows up to 3 color swatches
- **Navigation**: Prev/Next arrows for browsing
- **Progress Indicators**: Animated dots showing position
- **Selection Button**: Gradient CTA for choosing product
- **Counter**: Shows "X of Y" products

### Props

```javascript
{
  products: Array,           // Array of product objects
  onSelectProduct: Function  // Callback when product selected
}
```

---

## Integration with Chat

### Message Structure

To display the carousel in a chat message, use this structure:

```javascript
{
  id: unique_id,
  role: 'assistant',
  content: 'Your message text here',
  timestamp: new Date().toISOString(),
  component: {
    type: 'product-carousel',
    data: {
      products: [...],
      onSelectProduct: (product) => { /* handler */ }
    }
  }
}
```

### Example Usage

```javascript
const productMessage = {
  id: Date.now(),
  role: 'assistant',
  content: '🛍️ **Product Recommendations**\n\nHere are some products you might like:',
  timestamp: new Date().toISOString(),
  component: {
    type: 'product-carousel',
    data: {
      products: [
        {
          id: 1,
          title: 'Premium Wireless Headphones',
          price: 299.99,
          description: 'High-quality audio',
          image: 'https://...',
          colors: [
            { name: 'Black', hex: '#000000' },
            { name: 'White', hex: '#FFFFFF' }
          ]
        }
      ],
      onSelectProduct: (product) => {
        console.log('Selected:', product);
      }
    }
  }
};

setMessages(prev => [...prev, productMessage]);
```

---

## Demo Button

A demo button has been added to the chat header:

### Location
**Chat Interface Header** → Shopping Bag icon (🛒)

### Action
Clicking the button adds a message with the mini product carousel showing 3 sample products.

### Flow
1. User clicks shopping bag icon
2. AI message appears: "Product Recommendations"
3. Mini carousel displays below the message
4. User can browse products with arrows
5. Clicking "Select Product" triggers confirmation message

---

## Product Object Structure

```javascript
{
  id: Number,              // Unique identifier
  title: String,           // Product name (truncated in UI)
  price: Number,           // Numeric price (formatted as $XX.XX)
  description: String,     // Short description (1 line max)
  image: String,           // Image URL (square preferred)
  colors: Array [          // Optional color variants
    {
      name: String,        // Color name
      hex: String         // Hex color code (#RRGGBB)
    }
  ]
}
```

---

## Styling

### Colors
- Header: Purple-300 (#C084FC)
- Button Gradient: Purple-500 to Blue-500
- Background: White/10 opacity with glassmorphism
- Border: White/20 opacity
- Text: White with varying opacity

### Dimensions
- Container: `max-w-md` (448px max)
- Image: `80x80px` square
- Color Swatches: `12x12px` circles
- Progress Dots: `4px` wide when active, `4px` tall

### Animations
- Page transitions: Slide in from right
- Buttons: Scale on hover (1.1x) and tap (0.9x)
- Smooth carousel transitions (0.3s duration)

---

## User Experience

### Desktop Flow
```
1. AI suggests products
2. Carousel appears in chat
3. User hovers over arrows → Scale animation
4. User clicks next/prev → Product slides
5. User clicks "Select Product"
6. Callback triggers
7. Confirmation message appears
```

### Mobile Considerations
- Touch-friendly button sizes (min 44x44px)
- Swipe gestures not implemented (use arrows)
- Responsive to chat container width
- Images scale to fit available space

---

## Positioning

The carousel appears:
- **In chat messages** (left-aligned for AI messages)
- **Below text content** (3px margin-top)
- **Within message bubble** (respects max-width)
- **Scrollable container** (if chat is long)

---

## Customization

### Change Product Count
```javascript
// Show 5 products instead of 3
const demoProducts = [
  // ... 5 product objects
];
```

### Change Image Size
```javascript
// In ItemCarouselMini.jsx
<div className="w-24 h-24 ...">  {/* Changed from w-20 h-20 */}
```

### Add More Color Swatches
```javascript
// Show 5 colors instead of 3
{currentProduct.colors.slice(0, 5).map(...)}
```

### Custom Button Text
```javascript
<motion.button ...>
  View Details  {/* Instead of "Select Product" */}
</motion.button>
```

---

## Technical Details

### Dependencies
- React (hooks: useState)
- Framer Motion (animations)
- Lucide React (icons: ChevronLeft, ChevronRight, ShoppingBag)
- TailwindCSS (styling)

### Performance
- Minimal re-renders (only on index change)
- Lazy image loading with fallback
- Optimized animations (GPU-accelerated)
- Small bundle size (~4KB gzipped)

### Accessibility
- Button titles for tooltips
- Alt text for images
- Keyboard navigation support
- Color contrast compliance

---

## Testing

### Manual Test Steps

1. **Open Plugin**: Press Alt+L or click extension
2. **Navigate to Chat**: Click "Chat" tab
3. **Click Demo Button**: Shopping bag icon in header
4. **Verify Display**: Carousel appears below AI message
5. **Test Navigation**: Click left/right arrows
6. **Test Selection**: Click "Select Product" button
7. **Check Confirmation**: New message appears

### Expected Behavior
- ✅ Carousel displays 3 products
- ✅ Navigation cycles through products
- ✅ Progress dots update correctly
- ✅ Selection triggers confirmation message
- ✅ Animations are smooth
- ✅ Images load or show fallback

---

## Future Enhancements

Potential improvements:
- [ ] Swipe gestures for mobile
- [ ] Lazy load images
- [ ] Add to cart animation
- [ ] Product comparison feature
- [ ] Favorites/wishlist toggle
- [ ] Quick view modal
- [ ] Price range filter
- [ ] Sort by price/name
- [ ] Search products
- [ ] Category filtering

---

## API Integration

To connect with real products:

```javascript
// Fetch products from API
const fetchProducts = async () => {
  const response = await fetch('/api/products');
  const products = await response.json();
  return products;
};

// Use in demo function
const showProductDemo = async () => {
  const products = await fetchProducts();
  // ... rest of the code
};
```

---

## Troubleshooting

### Carousel Not Appearing
- Check message has `component` property
- Verify `component.type === 'product-carousel'`
- Ensure `products` array is not empty

### Images Not Loading
- Check image URLs are valid
- Verify CORS headers if external images
- Fallback SVG will display if image fails

### Selection Not Working
- Ensure `onSelectProduct` function is defined
- Check console for errors
- Verify product has required properties

---

**Built with ❤️ for seamless shopping experiences in chat interfaces**
