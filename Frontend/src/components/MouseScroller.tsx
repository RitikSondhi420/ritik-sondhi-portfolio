import React from 'react';
import { ChevronDown } from 'lucide-react';

interface MouseScrollerProps {
  targetId?: string;
  label?: string;
}

export const MouseScroller: React.FC<MouseScrollerProps> = ({
  targetId = 'experience',
  label = 'SCROLL TO EXPLORE',
}) => {
  const handleClick = () => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="mouse-scroller-container"
      title="Scroll to next section"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        padding: '12px',
        margin: '20px auto 0',
        width: 'fit-content',
        userSelect: 'none',
        transition: 'transform 0.25s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {/* Mouse Chassis */}
      <div
        className="mouse-chassis"
        style={{
          width: '24px',
          height: '40px',
          borderRadius: '14px',
          border: '2px solid rgba(45, 212, 191, 0.45)',
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '6px',
          boxShadow: '0 0 15px rgba(45, 212, 191, 0.15)',
          position: 'relative',
        }}
      >
        {/* Animated Scrolling Dot */}
        <div
          className="mouse-wheel-dot"
          style={{
            width: '4px',
            height: '8px',
            borderRadius: '4px',
            background: 'var(--cyan-light)',
            boxShadow: '0 0 8px var(--cyan-light)',
          }}
        />
      </div>

      {/* Chevrons and Monospace Label */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            letterSpacing: '1.2px',
            color: 'var(--text-muted)',
            fontWeight: 600,
          }}
        >
          {label}
        </span>
        <div className="mouse-scroller-arrows" style={{ display: 'flex', flexDirection: 'column', gap: '-6px' }}>
          <ChevronDown size={14} color="var(--cyan-light)" style={{ opacity: 0.8 }} />
        </div>
      </div>

      <style>{`
        @keyframes mouseWheelGlide {
          0% {
            opacity: 0;
            transform: translateY(0);
          }
          20% {
            opacity: 1;
          }
          70% {
            opacity: 1;
            transform: translateY(14px);
          }
          100% {
            opacity: 0;
            transform: translateY(18px);
          }
        }

        .mouse-wheel-dot {
          animation: mouseWheelGlide 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }

        @keyframes subtleChevronBob {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          50% {
            transform: translateY(4px);
            opacity: 1;
          }
        }

        .mouse-scroller-arrows {
          animation: subtleChevronBob 1.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
