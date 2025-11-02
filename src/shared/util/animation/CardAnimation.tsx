import React from 'react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface CardAnimationProps {
  children: React.ReactNode;
  index?: number;
  staggerChildren?: boolean;
  delay?: number;
  isInView?: boolean;
  className?: string;
  once?: boolean;
}

const CardAnimationComponent = ({
  children,
  index = 0,
  staggerChildren = false,
  delay = 0,
  isInView = true,
  className,
  once = false,
}: CardAnimationProps) => {
  const [hasAnimated, setHasAnimated] = useState(once ? false : true); // If not once, start as true for immediate animations
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimatedRef.current) {
      setHasAnimated(true);
      hasAnimatedRef.current = true;
    }
  }, [isInView]);

  const baseDelay = staggerChildren ? (index * 0.1) + delay : delay;

  const animationVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.7, // Midpoint between 0.6-0.8 seconds
        ease: "easeOut" as const,
        delay: hasAnimated ? baseDelay : 0,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
      variants={animationVariants}
      whileHover={{ 
        opacity: 0.9,
        transition: { duration: 0.2 }
      }}
      style={{
        boxShadow: hasAnimated 
          ? "0 8px 32px rgba(31, 38, 135, 0.1), 0 4px 16px rgba(255, 255, 255, 0.1)" 
          : "0 2px 8px rgba(31, 38, 135, 0.05), 0 1px 4px rgba(255, 255, 255, 0.05)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {children}
    </motion.div>
  );
};

export const CardAnimation = React.memo(CardAnimationComponent);

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
}

const StaggerContainerComponent = ({ children, className }: StaggerContainerProps) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export const StaggerContainer = React.memo(StaggerContainerComponent);