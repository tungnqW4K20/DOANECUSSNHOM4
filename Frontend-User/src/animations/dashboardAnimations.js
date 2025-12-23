/**
 * Framer Motion Animation Configurations for Dashboard
 * 
 * This file contains all animation variants used in the Dashboard (Tổng quan) page
 * to create smooth, professional animations for various components.
 */

/**
 * Container variant with stagger effect
 * Used for parent containers to create sequential animations for children
 */
export const containerVariants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 100ms delay between each child animation
      delayChildren: 0.2,   // Initial delay before children start animating
      duration: 0.3
    }
  }
};

/**
 * Stat card variant with fade-in and slide-up effect
 * Used for statistic cards to create an elegant entrance animation
 */
export const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20  // Start 20px below final position
  },
  visible: {
    opacity: 1,
    y: 0,  // Slide up to final position
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};

/**
 * Chart variant with fade-in effect
 * Used for chart components to create a smooth appearance
 */
export const chartVariants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  }
};

/**
 * Table variant with fade-in and delay
 * Used for the recent contracts table to appear after other elements
 */
export const tableVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.6,  // Delay to appear after stats and charts
      ease: 'easeOut'
    }
  }
};

/**
 * Hover animation for interactive elements
 * Can be used with whileHover prop on motion components
 */
export const hoverVariants = {
  scale: 1.02,
  transition: {
    duration: 0.2,
    ease: 'easeInOut'
  }
};

/**
 * Tap animation for clickable elements
 * Can be used with whileTap prop on motion components
 */
export const tapVariants = {
  scale: 0.98,
  transition: {
    duration: 0.1
  }
};

/**
 * Slide-in from left variant
 * Used for elements that should slide in from the left side
 */
export const slideInLeftVariants = {
  hidden: {
    opacity: 0,
    x: -50
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

/**
 * Slide-in from right variant
 * Used for elements that should slide in from the right side
 */
export const slideInRightVariants = {
  hidden: {
    opacity: 0,
    x: 50
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

/**
 * Page transition variant
 * Used for overall page entrance animation
 */
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
};

/**
 * Easing functions for custom animations
 * These can be used in custom transition configurations
 */
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  sharp: [0.4, 0, 0.6, 1]
};

/**
 * Spring configurations for bouncy animations
 * Can be used with type: 'spring' in transitions
 */
export const springConfigs = {
  gentle: {
    type: 'spring',
    stiffness: 100,
    damping: 15
  },
  bouncy: {
    type: 'spring',
    stiffness: 300,
    damping: 20
  },
  stiff: {
    type: 'spring',
    stiffness: 400,
    damping: 30
  }
};
