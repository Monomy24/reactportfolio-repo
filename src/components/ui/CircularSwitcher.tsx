import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useThemeStore, dimensionPacks } from '../../store/themeStore';
import { FiLayers } from 'react-icons/fi';
import type { DimensionType } from '../../types/theme';

export const CircularSwitcher: React.FC = () => {
  const { currentDimension, setHoveredDimension, triggerHop } = useThemeStore();
  const [isActivated, setIsActivated] = useState(false);

  const dimensions = Object.keys(dimensionPacks) as DimensionType[];

  // Dual-tone color configuration mapping matrix
  const switcherColorMap = {
    cosmic: { mainBg: '#ffffff', iconColor: '#000000', label: 'Cosmic' },
    arctic: { mainBg: '#B069DB', iconColor: '#ff6b35', label: 'Neon' },
    creamy: { mainBg: '#FFEE8C', iconColor: '#22d3ee', label: 'Creamy' }
  };

  const currentThemeColors = switcherColorMap[currentDimension];

  return (
    /* 
      SENIOR LAYOUT MATRIX:
      By default, the controller floats in the bottom-right corner.
      When a user moves their mouse or finger to this button, it instantly wakes up, 
      dims the screen, and glides gracefully into the dead-center of the screen.
    */
    <div 
      className={`fixed transition-all duration-500 ease-out z-50 flex items-center justify-center ${
        isActivated 
          ? 'inset-0 w-screen h-screen bg-black/50 backdrop-blur-sm pointer-events-auto' 
          : 'bottom-8 right-8 w-20 h-20 pointer-events-auto'
      }`}
      onMouseEnter={() => setIsActivated(true)}
      onMouseLeave={() => {
        setIsActivated(false);
        setHoveredDimension(null); // Safely clears cursor preview mutations on exit
      }}
    >
      {/* 
        AUTOMATED RADIAL PORTALS:
        Renders the three dimension dots immediately on hover. No click required.
      */}
      <AnimatePresence>
        {isActivated && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            {dimensions.map((dim, i) => {
              // Calculate spacing coordinates inside a radial unit-circle
              const angle = (i * 2 * Math.PI) / dimensions.length - Math.PI / 2;
              const radius = 115; // Expanded orbital boundary radius
              const targetColors = switcherColorMap[dim];

              return (
                <motion.button
                  key={`hop-${dim}`}
                  initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  /* 
                    0.4s LUXURY SPRING ENTRY: 
                    The buttons pop open smoothly around the center core.
                  */
                  animate={{ 
                    scale: 1, 
                    opacity: 1, 
                    x: Math.cos(angle) * radius, 
                    y: Math.sin(angle) * radius 
                  }}
                  exit={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  
                  /* 
                    CHAMELEON CURSOR PREVIEW INTERACTORS:
                    Hovering over a dot temporarily pushes its theme state to the store.
                    The custom cursor instantly transforms to show how that world feels.
                  */
                  onMouseEnter={() => setHoveredDimension(dim)}
                  onMouseLeave={() => setHoveredDimension(null)}
                  
                  onClick={(e) => {
                    e.stopPropagation(); // Stops event bubbling triggers
                    triggerHop(dim); // Fires full site-wide dimension change transformation
                    setIsActivated(false); // Collapses switcher layout back to corner
                  }}
                  className="absolute w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-[0_12px_35px_rgba(0,0,0,0.4)] border border-white/10 overflow-hidden group select-none cursor-pointer transition-transform duration-200"
                  style={{ backgroundColor: targetColors.mainBg }}
                >
                  {/* Dashed dynamic inner color ring indicator */}
                  <div 
                    className="absolute inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-2 border-dashed"
                    style={{ borderColor: targetColors.iconColor }}
                  />
                  <FiLayers className="text-xl mb-1 transition-transform group-hover:scale-110 duration-200" style={{ color: targetColors.iconColor }} />
                  <span className="text-[10px] font-extrabold tracking-wider uppercase font-sans" style={{ color: targetColors.iconColor }}>
                    {targetColors.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* CORE HUD TRIGGER ACTIVATION KEY */}
      <motion.button
        animate={{ 
          scale: isActivated ? 1.250 : 1.0,
          rotate: isActivated ? 45 : 0 
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        style={{ 
          backgroundColor: currentThemeColors.mainBg, 
          boxShadow: isActivated 
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${currentThemeColors.mainBg}30` 
            : '0 8px 24px rgba(0,0,0,0.2)' 
        }}
        className="w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-2xl transition-shadow cursor-pointer relative z-10 border border-white/10 outline-none select-none"
      >
        <FiLayers className="text-2xl transition-transform" style={{ color: currentThemeColors.iconColor }} />
      </motion.button>
    </div>
  );
};
