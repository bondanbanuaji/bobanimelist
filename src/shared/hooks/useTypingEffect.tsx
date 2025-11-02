import { useState, useEffect } from 'react';

interface UseTypingEffectOptions {
  text: string;
  initialDisplaySpeed?: number; // speed for initial full display in ms
  initialDeleteSpeed?: number; // speed for initial deletion in ms
  typingSpeed?: number; // typing speed in ms
  pauseDuration?: number; // pause duration at the end in ms (default 3500ms = 3.5 seconds)
  deleteSpeed?: number; // delete speed in ms
}

const useTypingEffect = ({
  text,
  initialDisplaySpeed = 30,
  initialDeleteSpeed = 50,
  typingSpeed = 100,
  pauseDuration = 1500, // Changed to 1.5 seconds as requested
  deleteSpeed = 80,
}: UseTypingEffectOptions) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'initialDisplay' | 'initialDelete' | 'typing' | 'pause' | 'deleting'>('initialDisplay');

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const handleTyping = () => {
      switch (phase) {
        case 'initialDisplay':
          // Display the full text instantly at start
          setCurrentText(text);
          timeout = setTimeout(() => {
            setPhase('initialDelete');
          }, initialDisplaySpeed);
          break;

        case 'initialDelete':
          // Delete the text quickly character by character
          if (currentText.length > 0) {
            timeout = setTimeout(() => {
              setCurrentText(prev => prev.substring(0, prev.length - 1));
            }, initialDeleteSpeed);
          } else {
            // Finished deleting, immediately start typing with no delay
            setPhase('typing');
            setCurrentIndex(0);
          }
          break;

        case 'typing':
          // Type the text character by character with no initial delay
          if (currentIndex < text.length) {
            timeout = setTimeout(() => {
              setCurrentText(text.substring(0, currentIndex + 1));
              setCurrentIndex(prev => prev + 1);
            }, typingSpeed);
          } else {
            // Finished typing, pause before deleting
            setPhase('pause');
            timeout = setTimeout(() => {
              setPhase('deleting');
            }, pauseDuration);
          }
          break;

        case 'pause':
          // Wait for pause duration then transition to deleting
          setPhase('deleting');
          timeout = setTimeout(() => {
            // Empty timeout to allow phase change to register
          }, 0);
          break;

        case 'deleting':
          // Delete the text character by character
          if (currentText.length > 0) {
            timeout = setTimeout(() => {
              setCurrentText(prev => prev.substring(0, prev.length - 1));
            }, deleteSpeed);
          } else {
            // Finished deleting, restart the loop by typing again (no delay after delete)
            setPhase('typing');
            setCurrentIndex(0);
          }
          break;

        default:
          break;
      }
    };

    // Only set timeout for typing and deleting phases, handle others immediately
    if (phase === 'initialDisplay' || phase === 'initialDelete' || phase === 'typing' || phase === 'deleting') {
      timeout = setTimeout(handleTyping, 
        phase === 'initialDisplay' ? initialDisplaySpeed : 
        phase === 'initialDelete' ? initialDeleteSpeed : 
        phase === 'typing' ? typingSpeed : 
        deleteSpeed // for deleting
      );
    } else if (phase === 'pause') {
      // For pause phase, wait for the pauseDuration then go to deleting
      timeout = setTimeout(() => {
        setPhase('deleting');
      }, pauseDuration);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [currentText, currentIndex, phase, text, initialDisplaySpeed, initialDeleteSpeed, typingSpeed, pauseDuration, deleteSpeed]);

  // Initialize the animation - start with empty text
  useEffect(() => {
    setCurrentText('');
    setPhase('initialDisplay');
  }, [text]);

  return { currentText, phase };
};

export default useTypingEffect;