import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(8, 11, 20, 0.95)',
        padding: 'clamp(28px, 5vw, 40px) clamp(16px, 4vw, 24px)',
        position: 'relative',
        zIndex: 1,
        width: '100%',
      }}
    >
      <div
        className="footer-content"
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem',
              color: '#ffffff',
              flexShrink: 0,
            }}
          >
            RS
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
              Ritik Sondhi
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Full Stack Developer • AI Workflow Specialist
            </div>
          </div>
        </div>

        {/* Telemetry pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.76rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-dim)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="status-beacon" style={{ width: '6px', height: '6px' }} />
            <span style={{ color: '#34d399' }}>Portfolio Engine: React 19 + TypeScript</span>
          </div>
          <span>•</span>
          <span>Zero-Regression Gate Active</span>
        </div>

        {/* Back to top button */}
        <button
          onClick={scrollToTop}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '7px 14px',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-main)';
            e.currentTarget.style.borderColor = 'var(--cyan-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
        >
          <span>Top</span>
          <ArrowUp size={14} />
        </button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .footer-content {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </footer>
  );
};
