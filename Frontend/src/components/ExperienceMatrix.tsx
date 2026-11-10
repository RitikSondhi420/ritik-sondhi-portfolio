import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import type { Experience } from '../data/portfolioData';
import { ScrollReveal } from './ScrollReveal';
import {
  Briefcase,
  MapPin,
  CheckCircle2,
  Bot,
  Layers,
  Edit3,
  Plus,
} from 'lucide-react';

interface ExperienceMatrixProps {
  onAskCopilot: (query: string) => void;
  onEditExperience?: (exp: Experience) => void;
  onAddExperience?: () => void;
}

export const ExperienceMatrix: React.FC<ExperienceMatrixProps> = ({
  onAskCopilot,
  onEditExperience,
  onAddExperience,
}) => {
  const { data, editMode } = usePortfolio();
  const { experiences } = data;
  const [activeExpId, setActiveExpId] = useState<string>(experiences[0]?.id || '');

  const activeExp = experiences.find((e) => e.id === activeExpId) || experiences[0];

  return (
    <section
      id="experience"
      className="section-wrapper"
      style={{
        padding: 'clamp(60px, 10vh, 100px) clamp(16px, 4vw, 24px)',
        maxWidth: '1240px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        width: '100%',
      }}
    >
      {/* Section Header */}
      <ScrollReveal animation="throw-down">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div style={{ maxWidth: '800px' }}>
            <div className="glass-pill" style={{ marginBottom: '14px' }}>
              <Briefcase size={14} color="var(--cyan-light)" />
              <span style={{ color: 'var(--cyan-light)', fontFamily: 'var(--font-mono)' }}>
                CAREER TRAJECTORY & IMPACT
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.85rem, 4vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-1px',
                marginBottom: '14px',
              }}
            >
              Engineering Scalable Systems Across{' '}
              <span className="gradient-text-purple">Global & Distributed Teams</span>
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.65 }}>
              From decoupled multi-channel payment microservices in Dubai to real-time telemetry grids in Mohali
              and collision-detection scheduling engines in West Bengal.
            </p>
          </div>

          {editMode && onAddExperience && (
            <button
              onClick={onAddExperience}
              className="btn-primary"
              style={{
                padding: '10px 18px',
                fontSize: '0.85rem',
              }}
            >
              <Plus size={16} />
              <span>Add New Experience</span>
            </button>
          )}
        </div>
      </ScrollReveal>

      {/* Experience Layout: Responsive Tabs + High-Impact Detail Card */}
      <div className="experience-layout">
        {/* Left Column / Mobile Horizontal Scroll: Company Selectors */}
        <ScrollReveal animation="throw-left" delayMs={100}>
          <div className="experience-tabs-container">
            {experiences.map((exp) => {
              const isSelected = exp.id === activeExp?.id;
              return (
                <div
                  key={exp.id}
                  onClick={() => setActiveExpId(exp.id)}
                  className="glass-panel experience-tab-item"
                  style={{
                    padding: '16px 18px',
                    cursor: 'pointer',
                    borderColor: isSelected ? 'var(--cyan-primary)' : 'var(--border-subtle)',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(13, 148, 136, 0.12), var(--bg-card))'
                      : 'var(--bg-card)',
                    boxShadow: isSelected
                      ? '0 8px 25px -5px rgba(13, 148, 136, 0.25)'
                      : 'var(--shadow-card)',
                    transition: 'all 0.25s ease',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '6px',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        color: isSelected ? 'var(--cyan-light)' : 'var(--text-main)',
                        wordBreak: 'break-word',
                      }}
                    >
                      {exp.company}
                    </span>
                    <span
                      className="code-tag"
                      style={{
                        fontSize: '0.7rem',
                        background: isSelected ? 'rgba(45, 212, 191, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        flexShrink: 0,
                      }}
                    >
                      {exp.period}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: '0.88rem',
                      color: isSelected ? 'var(--text-main)' : 'var(--text-muted)',
                      marginBottom: '8px',
                      fontWeight: 500,
                    }}
                  >
                    {exp.role}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.75rem',
                      color: 'var(--text-dim)',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} />
                      {exp.location}
                    </span>
                    <span>•</span>
                    <span>{exp.type}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Right Column: Detailed High-Density Deep Dive Card */}
        {activeExp && (
          <ScrollReveal animation="throw-right" delayMs={150}>
            <div
              className="glass-panel"
              style={{
                padding: 'clamp(20px, 3.5vw, 32px)',
                borderColor: 'rgba(45, 212, 191, 0.25)',
                background: 'var(--bg-card)',
                width: '100%',
              }}
            >
              {/* Header of Active Role */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '20px',
                  marginBottom: '22px',
                }}
              >
                <div style={{ flex: '1 1 260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)', fontWeight: 800, color: 'var(--text-main)', wordBreak: 'break-word' }}>
                      {activeExp.role}
                    </h3>
                    <span className="code-tag" style={{ color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', flexShrink: 0 }}>
                      Verified
                    </span>
                  </div>
                  <div style={{ fontSize: '0.96rem', color: 'var(--cyan-light)', fontWeight: 600 }}>
                    {activeExp.company} — {activeExp.location}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  {editMode && onEditExperience && (
                    <button
                      onClick={() => onEditExperience(activeExp)}
                      style={{
                        background: 'rgba(167, 139, 250, 0.12)',
                        border: '1px solid var(--purple-primary)',
                        borderRadius: '8px',
                        padding: '8px 14px',
                        color: 'var(--purple-light)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </button>
                  )}

                  <button
                    onClick={() => onAskCopilot(`Tell me about Ritik's work at ${activeExp.company}`)}
                    style={{
                      background: 'rgba(45, 212, 191, 0.12)',
                      border: '1px solid var(--cyan-primary)',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      color: 'var(--text-main)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(45, 212, 191, 0.22)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(45, 212, 191, 0.12)')}
                  >
                    <Bot size={14} color="var(--cyan-light)" />
                    <span>Ask Agent About This Role</span>
                  </button>
                </div>
              </div>

              {/* Architecture Highlight Box */}
              <div
                style={{
                  background: 'rgba(167, 139, 250, 0.06)',
                  border: '1px solid rgba(167, 139, 250, 0.2)',
                  borderRadius: '12px',
                  padding: 'clamp(14px, 2.5vw, 18px)',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--purple-light)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: '6px',
                  }}
                >
                  <Layers size={14} />
                  <span>SYSTEM ARCHITECTURE PATTERN:</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                  {activeExp.architectureHighlights}
                </p>
              </div>

              {/* Core Achievements List */}
              <div style={{ marginBottom: '28px' }}>
                <h4
                  style={{
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: '14px',
                  }}
                >
                  Key Production Engineering Deliverables:
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activeExp.achievements.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'rgba(45, 212, 191, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '3px',
                        }}
                      >
                        <CheckCircle2 size={12} color="var(--cyan-light)" />
                      </div>
                      <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Tags */}
              <div>
                <h4
                  style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    color: 'var(--text-dim)',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: '10px',
                  }}
                >
                  Technologies & Frameworks Deployed:
                </h4>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {activeExp.techStack.map((tech) => (
                    <span
                      key={tech}
                      style={{
                        background: 'var(--chip-bg)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        padding: '5px 10px',
                        fontSize: '0.78rem',
                        color: 'var(--text-main)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>

      <style>{`
        @media (max-width: 960px) {
          .experience-tabs-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
            gap: 12px;
            margin-bottom: 20px;
          }
          .experience-tab-item {
            margin-bottom: 0 !important;
          }
        }
      `}</style>
    </section>
  );
};
