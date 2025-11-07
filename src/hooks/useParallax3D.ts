import { useScroll, useTransform, MotionValue } from 'motion/react';
import { useRef, type RefObject } from 'react';

interface Parallax3DConfig {
  yRange?: [number, number];
  rotateXRange?: [number, number];
  rotateYRange?: [number, number];
  scaleRange?: [number, number];
  zRange?: [number, number];
}

interface Parallax3DResult {
  ref: RefObject<HTMLDivElement | null>;
  y: MotionValue<number>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  scale: MotionValue<number>;
  z: MotionValue<number>;
}

export const useParallax3D = (config: Parallax3DConfig = {}): Parallax3DResult => {
  const {
    yRange = [0, -100],
    rotateXRange = [0, 10],
    rotateYRange = [0, 0],
    scaleRange = [1, 1],
    zRange = [0, 50],
  } = config;

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], yRange);
  const rotateX = useTransform(scrollYProgress, [0, 1], rotateXRange);
  const rotateY = useTransform(scrollYProgress, [0, 1], rotateYRange);
  const scale = useTransform(scrollYProgress, [0, 1], scaleRange);
  const z = useTransform(scrollYProgress, [0, 1], zRange);

  return { ref, y, rotateX, rotateY, scale, z };
};

// Simplified hook for basic parallax
export const useScrollParallax = (offset: number = 100): Parallax3DResult => {
  return useParallax3D({
    yRange: [0, -offset],
    rotateXRange: [0, 5],
    zRange: [0, 20],
  });
};
