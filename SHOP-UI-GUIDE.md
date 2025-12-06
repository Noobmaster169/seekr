# Shop UI Components - Visual Guide

## 🎨 Component Flow

```
┌─────────────────────┐
│   ItemCarousel      │  Step 1: Browse Products
│  (Product Browser)  │  
│                     │  • Carousel navigation
│  ◄ [●] [ ] [ ] ►   │  • Image + Title + Price
│                     │  • Click to select
└──────────┬──────────┘
           │ Select Product
           ▼
┌─────────────────────┐
│  ItemSelection      │  Step 2: Customize
│ (Product Details)   │
│                     │  • Choose Color (visual swatches)
│  Color: ● ○ ○ ○    │  • Select Size (button grid)
│  Size:  [S] [M] [L]│  • Adjust Quantity (+ / -)
│  Qty:   - [2] +    │  • Validation before continue
└──────────┬──────────┘
           │ Confirm Selection
           ▼
┌─────────────────────┐
│ ItemConfirmation    │  Step 3: Review & Confirm
│  (Order Summary)    │
│                     │  • Success animation
│      ✓ [🛒]        │  • Product summary
│                     │  • Selection details
│  Total: $299.99    │  • Price breakdown
│  [Confirm & Go →]  │  • Redirect to store
└─────────────────────┘
```

---

## 🎯 UI Elements Breakdown

### **ItemCarousel**

```
┌──────────────────────────────────────────────┐
│  SELECT A PRODUCT                            │
│  Browse and choose from available items      │
├──────────────────────────────────────────────┤
│                                              │
│    ◄                                    ►    │
│                                              │
│  [prev]      [✨ MAIN ITEM ✨]      [next]  │
│              with full details               │
│                                              │
│           [Select This Product]              │
│                                              │
│              ● ○ ○ ○ ○                       │
│            (progress dots)                   │
└──────────────────────────────────────────────┘
```

**Features**:
- Large centered product card (active)
- Smaller side cards (preview)
- Arrow navigation buttons
- Progress dots at bottom
- "Select This Product" CTA button

---

### **ItemSelection**

```
┌──────────────────────────────────────────────┐
│  ← PRODUCT DETAILS                           │
│     Customize your selection                 │
├──────────────────────────────────────────────┤
│  ┌────────────────────────────────────────┐ │
│  │  [Product Image - Aspect Video]        │ │
│  │  Premium Wireless Headphones           │ │
│  │  $299.99                               │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  SELECT COLOR                                │
│  [● Black] [○ White] [○ Blue] [○ Red]       │
│                                              │
│  SELECT SIZE                                 │
│  [ XS ] [ S ] [✓ M ] [ L ] [ XL ]          │
│                                              │
│  QUANTITY                                    │
│      [ - ]    【 2 】    [ + ]              │
│                                              │
│  ℹ Make sure to select the right color...   │
│                                              │
├──────────────────────────────────────────────┤
│  [Continue to Confirmation]                  │
└──────────────────────────────────────────────┘
```

**Features**:
- Back button (top left)
- Product image with info
- Color swatches (visual circles)
- Size buttons (grid layout)
- Quantity controls (+/- buttons)
- Info box with tips
- Disabled state until selection complete

---

### **ItemConfirmation**

```
┌──────────────────────────────────────────────┐
│  ← CONFIRM PURCHASE                          │
│     Review your selection                    │
├──────────────────────────────────────────────┤
│                                              │
│              ┌─────────┐                     │
│              │    ✓    │ [🛒]                │
│              └─────────┘                     │
│         (success animation)                  │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ [img] Premium Wireless Headphones      │ │
│  │       $299.99                          │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  YOUR SELECTION                              │
│  ┌──────────┐  ┌──────────┐                 │
│  │Color     │  │Size      │                 │
│  │● Black   │  │M         │                 │
│  └──────────┘  └──────────┘                 │
│  ┌──────────┐  ┌──────────┐                 │
│  │Quantity  │  │Total     │                 │
│  │2         │  │$599.98   │                 │
│  └──────────┘  └──────────┘                 │
│                                              │
│  📦 Ready to purchase?                       │
│  Clicking "Confirm & Go to Store" will...   │
│                                              │
│  ORDER SUMMARY                               │
│  Subtotal........................... $599.98  │
│  Shipping............. Calculated at checkout│
│  ─────────────────────────────────────────   │
│  Total.............................. $599.98  │
│                                              │
├──────────────────────────────────────────────┤
│  [Confirm & Go to Store →]                   │
│  You'll be redirected to complete purchase   │
└──────────────────────────────────────────────┘
```

**Features**:
- Back button (top left)
- Animated success icon
- Product summary card
- Selection details (2x2 grid)
- Info box with explanation
- Order summary with breakdown
- Final CTA button
- Redirect notice

---

## 🎨 Design System

### **Colors**
- Primary Gradient: `from-purple-500 to-blue-500`
- Success: `green-400 to green-600`
- Background: Glassmorphism `bg-white/10`
- Borders: `border-white/20`
- Text: White with varying opacity

### **Components**
- Cards: Rounded corners (`rounded-xl`)
- Buttons: Hover animations (scale 1.02-1.1)
- Shadows: Layered depth (`shadow-2xl`)
- Backdrop: Blur effect (`backdrop-blur-xl`)

### **Typography**
- Headers: `font-bold text-lg/xl`
- Body: `text-sm/base`
- Price: `font-bold text-lg/xl` (purple-300)
- Labels: `text-xs text-white/60`

### **Spacing**
- Padding: `p-4` (16px)
- Gap: `gap-2/3/4` (8-16px)
- Margins: `mt-l/xl` for sections

---

## 📱 Responsive Behavior

All components are designed to:
- Scale properly within the overlay (520px width)
- Scroll vertically when content exceeds viewport
- Maintain aspect ratios for images
- Stack elements on smaller screens
- Keep buttons accessible at bottom

---

## ✨ Animations

### **Transitions**
```javascript
// Page transitions
initial: { opacity: 0, x: -20 }
animate: { opacity: 1, x: 0 }
exit: { opacity: 0, x: 20 }
```

### **Button Interactions**
```javascript
whileHover: { scale: 1.05 }
whileTap: { scale: 0.95 }
```

### **Success Icon**
```javascript
initial: { scale: 0 }
animate: { scale: 1 }
transition: { type: 'spring' }
```

---

## 🔄 State Management

### **ShopDemo State**
```javascript
currentView: 'carousel' | 'selection' | 'confirmation'
selectedProduct: Product | null
finalSelection: Selection | null
```

### **Progress Indicator**
Shows current step visually:
- `● ○ ○` - On carousel
- `○ ● ○` - On selection
- `○ ○ ●` - On confirmation

---

## 🎯 User Journey

1. **Discovery**: User sees product carousel
2. **Interest**: Clicks on product or "Select" button
3. **Customization**: Chooses color, size, quantity
4. **Validation**: Button disabled until all selections made
5. **Review**: Sees complete order summary
6. **Confirmation**: Clicks to proceed to store
7. **Redirect**: Simulated navigation (can be real)

---

## 🛠️ How to Test

1. Build the extension:
   ```bash
   npm run build:extension
   ```

2. Load in browser:
   - Open `chrome://extensions/`
   - Enable Developer mode
   - Load unpacked → select `dist` folder

3. Test the flow:
   - Visit any website
   - Press `Alt+L` or click extension icon
   - Click "Shop Demo" tab
   - Go through entire workflow

---

## 🎨 Customization Tips

### Change Colors:
```javascript
// Replace gradient:
className="bg-gradient-to-r from-purple-500 to-blue-500"
// With:
className="bg-gradient-to-r from-red-500 to-orange-500"
```

### Adjust Layout:
```javascript
// Carousel: Change visible items
const visibleProducts = [prev, current, next];
// Make it show 5 items instead

// Grid: Change columns
className="grid grid-cols-2 gap-3"
// Change to grid-cols-3 for more items
```

### Add New Product Fields:
```javascript
// In product object:
{
  ...existing fields,
  brand: 'Brand Name',
  rating: 4.5,
  reviews: 1234
}
```

---

## 📊 Sample Products Included

The demo includes 5 sample products:
1. Premium Wireless Headphones ($299.99)
2. Smart Fitness Watch ($449.99)
3. Designer Sneakers ($189.99)
4. Leather Backpack ($159.99)
5. Minimalist Sunglasses ($129.99)

All with realistic images from Unsplash and complete product data.

---

**Made with ❤️ using React, Framer Motion, and TailwindCSS**
