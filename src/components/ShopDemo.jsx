import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ItemCarousel from './ItemCarousel';
import ItemSelection from './ItemSelection';
import ItemConfirmation from './ItemConfirmation';

const ShopDemo = () => {
  const [currentView, setCurrentView] = useState('carousel'); // 'carousel', 'selection', 'confirmation'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [finalSelection, setFinalSelection] = useState(null);

  // Demo products data
  const demoProducts = [
    {
      id: 'uniqlo-E465191-000',
      title: 'DRY-EX Crew Neck T-shirt',
      price: 49.90,
      description: 'Quick-drying fabric for ultimate comfort during workouts',
      image: 'https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/465191/item/mygoods_09_465191.jpg',
      isUniqlo: true,
      uniqloProductId: 'E465191-000',
      // Colors and sizes will be loaded dynamically
      colors: [],
      sizes: [],
    },
    {
      id: 1,
      title: 'Premium Wireless Headphones',
      price: 299.99,
      description: 'High-quality audio with active noise cancellation',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      colors: [
        { name: 'Midnight Black', hex: '#1a1a1a' },
        { name: 'Silver', hex: '#C0C0C0' },
        { name: 'Rose Gold', hex: '#B76E79' },
      ],
      sizes: ['One Size'],
    },
    {
      id: 2,
      title: 'Smart Fitness Watch',
      price: 449.99,
      description: 'Track your health and fitness goals with precision',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      colors: [
        { name: 'Space Gray', hex: '#52575C' },
        { name: 'Gold', hex: '#FFD700' },
        { name: 'White', hex: '#FFFFFF' },
      ],
      sizes: ['38mm', '42mm', '44mm'],
    },
    {
      id: 3,
      title: 'Designer Sneakers',
      price: 189.99,
      description: 'Comfortable and stylish for everyday wear',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      colors: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Black', hex: '#000000' },
        { name: 'Navy Blue', hex: '#001f3f' },
      ],
      sizes: ['7', '8', '9', '10', '11', '12'],
    },
    {
      id: 4,
      title: 'Leather Backpack',
      price: 159.99,
      description: 'Spacious and durable for daily commute',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      colors: [
        { name: 'Brown', hex: '#8B4513' },
        { name: 'Black', hex: '#000000' },
        { name: 'Tan', hex: '#D2B48C' },
      ],
      sizes: ['One Size'],
    },
    {
      id: 5,
      title: 'Minimalist Sunglasses',
      price: 129.99,
      description: 'UV protection with timeless style',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
      colors: [
        { name: 'Black Frame', hex: '#000000' },
        { name: 'Tortoise', hex: '#8B4513' },
        { name: 'Clear', hex: '#E8E8E8' },
      ],
      sizes: ['One Size'],
    },
  ];

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView('selection');
  };

  const handleConfirmSelection = (selection) => {
    setFinalSelection(selection);
    setCurrentView('confirmation');
  };

  const handleFinalConfirm = (selection) => {
    console.log('Final purchase confirmed:', selection);
    
    // Handle Uniqlo redirect
    if (selection.product.isUniqlo && selection.product.url) {
      const colorCode = selection.color.value || '00';
      const sizeValue = typeof selection.size === 'object' ? selection.size.value : selection.size;
      const sizeCode = sizeValue || '003';
      const uniqloUrl = `${selection.product.url}?colorDisplayCode=${colorCode}&sizeDisplayCode=${sizeCode}`;
      
      console.log('Redirecting to Uniqlo:', uniqloUrl);
      window.open(uniqloUrl, '_blank');
    } else {
      // Simulate redirect to store for other products
      alert(`Redirecting to store for:\n${selection.product.title}\nColor: ${selection.color.name}\nSize: ${typeof selection.size === 'object' ? selection.size.name : selection.size}\nQuantity: ${selection.quantity}`);
    }
    
    // Reset to carousel
    setTimeout(() => {
      setCurrentView('carousel');
      setSelectedProduct(null);
      setFinalSelection(null);
    }, 500);
  };

  const handleBackToCarousel = () => {
    setCurrentView('carousel');
    setSelectedProduct(null);
  };

  const handleBackToSelection = () => {
    setCurrentView('selection');
    setFinalSelection(null);
  };

  return (
    <div className="h-full relative">
      <AnimatePresence mode="wait">
        {currentView === 'carousel' && (
          <motion.div
            key="carousel"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <ItemCarousel 
              products={demoProducts} 
              onSelectProduct={handleSelectProduct}
            />
          </motion.div>
        )}

        {currentView === 'selection' && selectedProduct && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <ItemSelection
              product={selectedProduct}
              onConfirm={handleConfirmSelection}
              onBack={handleBackToCarousel}
            />
          </motion.div>
        )}

        {currentView === 'confirmation' && finalSelection && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <ItemConfirmation
              selection={finalSelection}
              onConfirm={handleFinalConfirm}
              onBack={handleBackToSelection}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      <div className="absolute top-2 right-4 z-10">
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
          <div className={`w-2 h-2 rounded-full transition-all ${currentView === 'carousel' ? 'bg-purple-400 w-3' : 'bg-white/30'}`} />
          <div className={`w-2 h-2 rounded-full transition-all ${currentView === 'selection' ? 'bg-purple-400 w-3' : 'bg-white/30'}`} />
          <div className={`w-2 h-2 rounded-full transition-all ${currentView === 'confirmation' ? 'bg-purple-400 w-3' : 'bg-white/30'}`} />
        </div>
      </div>
    </div>
  );
};

export default ShopDemo;
