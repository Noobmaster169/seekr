import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import ItemSelection from './ItemSelection';
import ItemConfirmation from './ItemConfirmation';

const UniqloDemo = () => {
  const [currentView, setCurrentView] = useState('loading'); // 'loading', 'selection', 'confirmation'
  const [productData, setProductData] = useState(null);
  const [finalSelection, setFinalSelection] = useState(null);
  const [error, setError] = useState(null);

  // Uniqlo product ID to demo
  const DEMO_PRODUCT_ID = 'E465191-000';
  const DEMO_PRODUCT_NAME = 'DRY-EX Crew Neck T-shirt | Short Sleeve';
  const DEMO_PRODUCT_PRICE = 49.90;
  const DEMO_PRODUCT_IMAGE = 'https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/465191/item/mygoods_09_465191.jpg';

  useEffect(() => {
    loadProductData();
  }, []);

  const loadProductData = async () => {
    try {
      setCurrentView('loading');
      setError(null);

      // Dynamically import the scraper
      const { scrapeUniqloProductOptions } = await import('../../utils/scraper/index.js');
      
      console.log('Fetching Uniqlo product data...');
      const result = await scrapeUniqloProductOptions(DEMO_PRODUCT_ID);

      if (result.success) {
        // Transform Uniqlo data to match our component format
        const product = {
          id: DEMO_PRODUCT_ID,
          title: DEMO_PRODUCT_NAME,
          price: DEMO_PRODUCT_PRICE,
          description: 'Quick-drying fabric for ultimate comfort during workouts and daily activities.',
          image: DEMO_PRODUCT_IMAGE,
          url: result.url,
          // Transform colors to include both iconUrl and a fallback hex
          colors: result.colors.map(color => ({
            name: color.name,
            value: color.value,
            iconUrl: color.iconUrl,
            hex: getColorHex(color.name) // Fallback color
          })),
          // Transform sizes to filter only available ones
          sizes: result.sizes.map(size => ({
            name: size.name,
            value: size.value,
            available: size.available
          }))
        };

        setProductData(product);
        setCurrentView('selection');
      } else {
        throw new Error(result.error || 'Failed to fetch product data');
      }
    } catch (err) {
      console.error('Error loading product:', err);
      setError(err.message);
      setCurrentView('error');
    }
  };

  // Helper function to get approximate hex colors
  const getColorHex = (colorName) => {
    const colorMap = {
      'WHITE': '#FFFFFF',
      'GRAY': '#9CA3AF',
      'DARK GRAY': '#4B5563',
      'BLACK': '#000000',
      'RED': '#EF4444',
      'ORANGE': '#F97316',
      'GREEN': '#10B981',
      'BLUE': '#3B82F6',
      'NAVY': '#1E40AF',
      'YELLOW': '#FCD34D',
      'PINK': '#EC4899',
      'PURPLE': '#A855F7',
      'BROWN': '#92400E',
    };

    // Try to find a matching color
    const normalizedName = colorName.toUpperCase();
    for (const [key, value] of Object.entries(colorMap)) {
      if (normalizedName.includes(key)) {
        return value;
      }
    }
    return '#9CA3AF'; // Default gray
  };

  const handleConfirmSelection = (selection) => {
    setFinalSelection(selection);
    setCurrentView('confirmation');
  };

  const handleFinalConfirm = (selection) => {
    console.log('Final purchase confirmed:', selection);
    
    // Build Uniqlo URL with selected options
    const { product, color, size } = selection;
    // Uniqlo URL format: https://www.uniqlo.com/my/en/products/E465191-000/00?colorDisplayCode=09&sizeDisplayCode=003
    const colorCode = color.value || '00';
    const sizeCode = size.value || '003';
    const uniqloUrl = `${product.url}?colorDisplayCode=${colorCode}&sizeDisplayCode=${sizeCode}`;
    
    console.log('Redirecting to:', uniqloUrl);
    
    // Open Uniqlo page in new tab
    window.open(uniqloUrl, '_blank');
    
    // Optionally reset the demo
    setTimeout(() => {
      setCurrentView('selection');
      setFinalSelection(null);
    }, 500);
  };

  const handleBackToSelection = () => {
    setCurrentView('selection');
    setFinalSelection(null);
  };

  const handleRetry = () => {
    loadProductData();
  };

  return (
    <div className="h-full relative bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-purple-900/40">
      <AnimatePresence mode="wait">
        {/* Loading State */}
        {currentView === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center p-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-12 h-12 text-purple-400" />
            </motion.div>
            <h3 className="text-white font-semibold text-lg mt-4">Loading Uniqlo Product...</h3>
            <p className="text-white/60 text-sm mt-2">Fetching real-time data from Uniqlo</p>
          </motion.div>
        )}

        {/* Error State */}
        {currentView === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center p-8"
          >
            <div className="bg-red-500/20 border border-red-400/30 rounded-full p-4 mb-4">
              <AlertCircle className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-white font-semibold text-lg">Failed to Load Product</h3>
            <p className="text-white/60 text-sm mt-2 text-center max-w-md">
              {error || 'An error occurred while fetching product data'}
            </p>
            <motion.button
              onClick={handleRetry}
              className="mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold transition-all shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </motion.div>
        )}

        {/* Selection View */}
        {currentView === 'selection' && productData && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <ItemSelection
              product={productData}
              onConfirm={handleConfirmSelection}
              onBack={handleRetry}
            />
          </motion.div>
        )}

        {/* Confirmation View */}
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

      {/* Product Info Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/50 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
          <p className="text-white/60 text-xs">Demo Product</p>
          <p className="text-white font-semibold text-sm">{DEMO_PRODUCT_ID}</p>
        </div>
      </div>

      {/* Progress Indicator */}
      {currentView !== 'loading' && currentView !== 'error' && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10">
            <div className={`w-2 h-2 rounded-full transition-all ${currentView === 'selection' ? 'bg-purple-400 w-3' : 'bg-white/30'}`} />
            <div className={`w-2 h-2 rounded-full transition-all ${currentView === 'confirmation' ? 'bg-purple-400 w-3' : 'bg-white/30'}`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UniqloDemo;
