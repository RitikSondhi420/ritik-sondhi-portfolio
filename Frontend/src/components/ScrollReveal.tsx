import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'throw-up' | 'throw-down' | 'throw-left' | 'throw-right' | 'pop-in';
  delayMs?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'throw-up',
  delayMs = 0,
  className = '',
  style = {},
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Smoothly reveal on entering viewport, keep visible to eliminate flickering
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (currentTarget) {
            observer.unobserve(currentTarget);
          }
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    const currentTarget = domRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, []);

  const getTransform = () => {
    if (isVisible) {
      return 'perspective(1200px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(1)';
    }

    switch (animation) {
      case 'throw-up':
        return 'perspective(1200px) translate3d(0, 48px, -40px) rotateX(7deg) scale(0.95)';
      case 'throw-down':
        return 'perspective(1200px) translate3d(0, -40px, -30px) rotateX(-6deg) scale(0.96)';
      case 'throw-left':
        return 'perspective(1200px) translate3d(-50px, 15px, -30px) rotateY(-8deg) scale(0.95)';
      case 'throw-right':
        return 'perspective(1200px) translate3d(50px, 15px, -30px) rotateY(8deg) scale(0.95)';
      case 'pop-in':
        return 'perspective(1200px) translate3d(0, 20px, -60px) scale(0.9)';
      default:
        return 'perspective(1200px) translate3d(0, 40px, 0) scale(0.96)';
    }
  };

  return (
    <div
      ref={domRef}
      className={`scroll-throw-node ${className}`}
      style={{
        ...style,
        transform: getTransform(),
        opacity: isVisible ? 1 : 0.08,
        transition: `transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
};
