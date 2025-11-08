import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import styles from './AnimatedLogo.module.scss';

interface AnimatedLogoProps {
  onAnimationComplete?: () => void;
}

function AnimatedLogo({ onAnimationComplete }: AnimatedLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const animationDuration = 2500; // Reduced from 10s to 2.5s

    const timer = setTimeout(() => {
      if (onAnimationComplete) onAnimationComplete();
    }, animationDuration);

    return () => {
      clearTimeout(timer);
    };
  }, [onAnimationComplete]);

  return (
    <div className={styles['animated-logo-container']} ref={containerRef}>
      {/* Laser Beams - Quick red laser effects */}
      <div className={styles['laser-container']}>
        {/* Rapid laser beams crisscrossing */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={styles['laser-beam']}
            style={{
              top: `${20 + i * 12}%`,
              left: i % 2 === 0 ? '-100%' : 'auto',
              right: i % 2 === 1 ? '-100%' : 'auto',
            }}
            initial={{ x: 0, opacity: 0 }}
            animate={{ 
              x: i % 2 === 0 ? '200vw' : '-200vw',
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 0.4,
              delay: i * 0.08,
              ease: "linear",
              opacity: {
                duration: 0.4,
                times: [0, 0.2, 0.8, 1]
              }
            }}
          />
        ))}
      </div>

      {/* 3D Logo Container - appears quickly after lasers */}
      <motion.div 
        className={styles['logo-3d-wrapper']}
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
          delay: 0.6,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {/* Glow Effect Layer */}
        <div className={styles['glow-layer']} />
        
        {/* Main Logo SVG - B with slice effect (appears after wrapper) */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 300"
          className={styles['animated-logo-svg']}
          initial={{ scale: 1.3, opacity: 0, rotateZ: 10 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            rotateZ: 0
          }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {/* Clip path untuk efek terbelah - dipotong di 30% dari atas */}
          <defs>
            <clipPath id="top-slice">
              {/* Hanya bagian atas (0 sampai 30% dari tinggi logo) */}
              <rect
                x="0"
                y="0"
                width="300"
                height="105"
              />
            </clipPath>
            <clipPath id="bottom-slice">
              {/* Hanya bagian bawah (30% ke bawah) */}
              <rect
                x="0"
                y="105"
                width="300"
                height="195"
              />
            </clipPath>
          </defs>

          {/* Logo utuh (muncul dulu, lalu hilang) */}
          <motion.g
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ 
              duration: 0.1, 
              delay: 1.3,
              ease: "linear"
            }}
          >
            <motion.path
              className={styles['logo-path']}
              d="M80 60c22-2 45-2 67 1 18 3 35 9 47 22 9 10 13 22 13 35 0 18-9 33-26 42 21 8 34 24 37 45 3 25-8 46-29 59-14 9-31 13-49 14-20 1-40 1-60 0l-2-2c3-4 3-8 3-12V75c0-5-1-9-2-13l1-2c1 0 2 0 3 0h7zm35 92h25c10 0 19-3 26-9 8-7 12-15 11-26-1-11-6-19-16-24-7-3-15-4-24-4h-22v63zm0 97h27c10 0 19-2 27-8 9-6 14-15 13-27-1-14-8-24-21-29-7-3-14-4-22-4h-24v68z"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: {
                  duration: 0.8,
                  delay: 0.2,
                  ease: "easeInOut"
                },
                opacity: {
                  duration: 0.3,
                  delay: 0.2
                }
              }}
            />
          </motion.g>

          {/* Top part (30% atas - muncul SETELAH logo utuh hilang) */}
          <motion.g
            clipPath="url(#top-slice)"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x: -8, y: -10, opacity: 1 }}
            transition={{ 
              x: { duration: 0.5, delay: 1.4, ease: [0.4, 0, 0.2, 1] },
              y: { duration: 0.5, delay: 1.4, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.1, delay: 1.3, ease: "linear" }
            }}
          >
            <path
              className={styles['logo-path']}
              d="M80 60c22-2 45-2 67 1 18 3 35 9 47 22 9 10 13 22 13 35 0 18-9 33-26 42 21 8 34 24 37 45 3 25-8 46-29 59-14 9-31 13-49 14-20 1-40 1-60 0l-2-2c3-4 3-8 3-12V75c0-5-1-9-2-13l1-2c1 0 2 0 3 0h7zm35 92h25c10 0 19-3 26-9 8-7 12-15 11-26-1-11-6-19-16-24-7-3-15-4-24-4h-22v63zm0 97h27c10 0 19-2 27-8 9-6 14-15 13-27-1-14-8-24-21-29-7-3-14-4-22-4h-24v68z"
            />
          </motion.g>

          {/* Bottom part (70% bawah - muncul SETELAH logo utuh hilang) */}
          <motion.g
            clipPath="url(#bottom-slice)"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x: 8, y: 10, opacity: 1 }}
            transition={{ 
              x: { duration: 0.5, delay: 1.4, ease: [0.4, 0, 0.2, 1] },
              y: { duration: 0.5, delay: 1.4, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.1, delay: 1.3, ease: "linear" }
            }}
          >
            <path
              className={styles['logo-path']}
              d="M80 60c22-2 45-2 67 1 18 3 35 9 47 22 9 10 13 22 13 35 0 18-9 33-26 42 21 8 34 24 37 45 3 25-8 46-29 59-14 9-31 13-49 14-20 1-40 1-60 0l-2-2c3-4 3-8 3-12V75c0-5-1-9-2-13l1-2c1 0 2 0 3 0h7zm35 92h25c10 0 19-3 26-9 8-7 12-15 11-26-1-11-6-19-16-24-7-3-15-4-24-4h-22v63zm0 97h27c10 0 19-2 27-8 9-6 14-15 13-27-1-14-8-24-21-29-7-3-14-4-22-4h-24v68z"
            />
          </motion.g>

          {/* Slice line (garis potong di 30% dari atas - muncul SEBELUM split) */}
          <motion.line
            x1="40"
            y1="95"
            x2="260"
            y2="115"
            stroke="var(--logo-stroke-color)"
            strokeWidth="2.5"
            className={styles['slice-line']}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 1],
              opacity: [0, 1, 0.5]
            }}
            transition={{
              duration: 0.5,
              delay: 1.1,
              times: [0, 0.5, 1],
              ease: "easeInOut"
            }}
          />
        </motion.svg>

        {/* Quick Flash Effect */}
        <motion.div
          className={styles['flash-effect']}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.2, delay: 0.3 }}
        />
      </motion.div>
    </div>
  );
}

export default AnimatedLogo;