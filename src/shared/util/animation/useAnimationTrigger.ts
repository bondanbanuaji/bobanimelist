import { useState, useEffect, useRef } from 'react';

interface AnimationOptions {
  once?: boolean;
  threshold?: number;
}

export const useAnimationTrigger = (options: AnimationOptions = {}) => {
  const { once = false, threshold = 0.1 } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(!once); // If not once, start as true for immediate animations
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          if (!once) {
            setShouldAnimate(true);
          } else if (!hasAnimatedRef.current) {
            setShouldAnimate(true);
            hasAnimatedRef.current = true;
          }
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [once, threshold]);

  return { ref, shouldAnimate };
};