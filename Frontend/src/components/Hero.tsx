import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { MouseScroller } from './MouseScroller';
import { ScrollReveal } from './ScrollReveal';
import {
  Bot,
  Terminal,
  Cpu,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Sparkles,
  Database,
  Layers,
  GitBranch,
  Edit3,
} from 'lucide-react';

interface HeroProps {
  onOpenCopilotWithQuery?: (query: string) => void;
  onEditPersonal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCopilotWithQuery, onEditPersonal }) => {
  const { data, editMode } = usePortfolio();
  const { personal } = data;

  const quickPrompts = [
    'How did you decouple payment APIs at Propertise?',
    'Is Ritik good with Python and AI tooling?',
    'Explain the collision detection algorithm at BrainCave',
    'Evaluate candidate match for Full Stack Lead role',
  ];

  return (
    <section
      id="overview"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(96px, 13vh, 130px) clamp(16px, 4vw, 24px) 40px',
        maxWidth: '1240px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        width: '100%',
      }}
    >
      {/* Top Status & Relocation Badges */}
      <ScrollReveal animation="throw-down" delayMs={50}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px',
          }}
        >
          <div
            className="glass-pill"
            style={{
              borderColor: 'rgba(52, 211, 153, 0.3)',
              background: 'rgba(52, 211, 153, 0.08)',
            }}
          >
            <span className="status-beacon" />
            <span style={{ color: '#34d399', fontSize: '0.82rem', fontWeight: 600 }}>
              {personal.relocation}
            </span>
          </div>

          <div className="glass-pill">
            <MapPin size={14} color="var(--cyan-light)" />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              {personal.location}
            </span>
          </div>

          <div className="glass-pill">
            <Cpu size={14} color="var(--purple-light)" />
            <span style={{ color: 'var(--purple-light)', fontSize: '0.82rem', fontWeight: 500 }}>
              Full Stack & Microservices
            </span>
          </div>

          {editMode && onEditPersonal && (
            <button
              onClick={onEditPersonal}
              style={{
                background: 'rgba(45, 212, 191, 0.15)',
                border: '1px solid var(--cyan-primary)',
                borderRadius: '9999px',
                padding: '6px 14px',
                color: 'var(--cyan-light)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 0 15px rgba(45, 212, 191, 0.2)',
              }}
            >
              <Edit3 size={13} />
              <span>Edit Profile & Bio</span>
            </button>
          )}
        </div>
      </ScrollReveal>

      {/* Main Hero Header */}
      <ScrollReveal animation="throw-up" delayMs={100}>
        <div style={{ maxWidth: '980px', marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: 'clamp(2.3rem, 5.8vw, 4.8rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              marginBottom: '16px',
              wordBreak: 'break-word',
            }}
          >
            Hi, I'm <span className="gradient-text-cyan">{personal.name}</span>
          </h1>

          <h2
            style={{
              fontSize: 'clamp(1.15rem, 2.4vw, 1.8rem)',
              fontWeight: 600,
              color: 'var(--purple-light)',
              marginBottom: '20px',
              letterSpacing: '-0.3px',
              lineHeight: 1.3,
            }}
          >
            {personal.title}
          </h2>

          <p
            style={{
              fontSize: 'clamp(0.96rem, 1.3vw, 1.15rem)',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              maxWidth: '860px',
            }}
          >
            {personal.summary}
          </p>
        </div>
      </ScrollReveal>

      {/* Primary Action Buttons */}
      <ScrollReveal animation="throw-up" delayMs={150}>
        <div className="hero-cta-group">
          <button
            onClick={() => onOpenCopilotWithQuery?.('Give me an executive summary of Ritik Sondhi')}
            className="btn-primary"
            style={{ padding: '13px 26px', fontSize: '0.96rem' }}
          >
            <Bot size={18} />
            <span>Launch Ritik AI Copilot</span>
          </button>

          <a
            href="#architecture"
            className="btn-secondary"
            style={{ textDecoration: 'none', padding: '13px 22px', fontSize: '0.96rem' }}
          >
            <Layers size={18} color="var(--cyan-light)" />
            <span>Explore Architecture</span>
          </a>

          <a
            href="#experience"
            className="btn-secondary"
            style={{ textDecoration: 'none', padding: '13px 22px', fontSize: '0.96rem' }}
          >
            <GitBranch size={18} color="var(--purple-light)" />
            <span>Career Matrix</span>
          </a>
        </div>
      </ScrollReveal>

      {/* Interactive AI Prompt Drawer Opener Chips */}
      <ScrollReveal animation="pop-in" delayMs={200}>
        <div
          className="glass-panel"
          style={{
            padding: 'clamp(14px, 2.5vw, 20px)',
            marginBottom: '36px',
            background: 'var(--bg-card)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              fontSize: '0.8rem',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <Terminal size={14} color="var(--cyan-light)" />
            <span>INSTANT AI AGENT INQUIRY PROMPTS (CLICK TO SIMULATE):</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => onOpenCopilotWithQuery?.(prompt)}
                style={{
                  background: 'rgba(255, 255, 255, 0.035)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'var(--text-main)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  maxWidth: '100%',
                  lineHeight: 1.4,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--cyan-primary)';
                  e.currentTarget.style.background = 'var(--tag-bg)';
                  e.currentTarget.style.color = 'var(--text-main)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.035)';
                  e.currentTarget.style.color = 'var(--text-main)';
                }}
              >
                <Sparkles size={12} color="var(--cyan-light)" style={{ flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-word' }}>"{prompt}"</span>
                <ArrowRight size={12} color="var(--text-dim)" style={{ flexShrink: 0, marginLeft: 'auto' }} />
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Live Telemetry & Bento Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: '16px',
          marginBottom: '28px',
          width: '100%',
        }}
      >
        {personal.metrics.map((metric, idx) => (
          <ScrollReveal
            key={metric.label}
            animation={idx % 2 === 0 ? 'throw-left' : 'throw-right'}
            delayMs={150 + idx * 60}
          >
            <div
              className="glass-panel"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.74rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {metric.label}
                </span>
                {idx === 0 && <Cpu size={16} color="var(--cyan-light)" />}
                {idx === 1 && <ShieldCheck size={16} color="#34d399" />}
                {idx === 2 && <GitBranch size={16} color="var(--purple-light)" />}
                {idx === 3 && <Database size={16} color="#38bdf8" />}
              </div>

              <div
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  color: idx === 0 ? 'var(--cyan-light)' : idx === 1 ? 'var(--emerald-primary)' : 'var(--text-main)',
                  letterSpacing: '-0.5px',
                }}
              >
                {metric.value}
              </div>

              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)',
                  marginTop: '4px',
                }}
              >
                {idx === 0 && 'Scalable microservices & UI grids'}
                {idx === 1 && 'Strict compile checks & zero regressions'}
                {idx === 2 && 'Dubai, Punjab, WB & Greater Noida'}
                {idx === 3 && 'Automated Docker test runners'}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Animated Mouse Scroller */}
      <MouseScroller targetId="experience" label="SCROLL TO EXPLORE" />
    </section>
  );
};
