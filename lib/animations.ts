// Animation variants for Framer Motion

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
};

export const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const itemFadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeInOut"
    }
  }
};

export const scaleIn = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0] 
    }
  }
};

export const cardHover = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.03,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

export const buttonTap = {
  rest: { scale: 1 },
  tap: { scale: 0.97 },
  hover: { scale: 1.05 }
};

export const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: { opacity: 0 }
};

export const slideFromRight = {
  hidden: { x: 100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  exit: { 
    x: 100, 
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

export const slideFromLeft = {
  hidden: { x: -100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  exit: { 
    x: -100, 
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

export const popIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25
    }
  }
}; 