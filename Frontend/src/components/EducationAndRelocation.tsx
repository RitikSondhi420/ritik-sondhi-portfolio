import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ScrollReveal } from './ScrollReveal';
import { GraduationCap, Plane, CheckCircle, Languages, Edit3 } from 'lucide-react';

interface EducationAndRelocationProps {
  onManageEducation?: () => void;
  onEditMobility?: () => void;
  onManageLanguages?: () => void;
}

export const EducationAndRelocation: React.FC<EducationAndRelocationProps> = ({
  onManageEducation,
  onEditMobility,
  onManageLanguages,
}) => {
  const { data, editMode } = usePortfolio();
  const { education, personal, mobility } = data;

  return (
    <section
      id="education"
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '24px',
          width: '100%',
        }}
      >
        {/* Education Column */}
        <ScrollReveal animation="throw-left" delayMs={50}>
          <div
            className="glass-panel"
            style={{
              padding: 'clamp(20px, 3.5vw, 32px)',
              background: 'var(--bg-card)',
              height: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '22px',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '14px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(139, 92, 246, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <GraduationCap size={20} color="var(--purple-light)" />
                </div>
                <div>
                  <h3 style={{ fontSize: 'clamp(1.15rem, 2vw, 1.25rem)', fontWeight: 800, color: 'var(--text-main)' }}>
                    Academic Credentials
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Chitkara University & Verified Higher Education
                  </div>
                </div>
              </div>

              {editMode && onManageEducation && (
                <button
                  onClick={onManageEducation}
                  style={{
                    background: 'rgba(139, 92, 246, 0.15)',
                    border: '1px solid var(--purple-primary)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    color: 'var(--purple-light)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Edit3 size={13} />
                  <span>Edit</span>
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {education.map((edu) => (
                <div
                  key={edu.degree}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                      flexWrap: 'wrap',
                      gap: '6px',
                    }}
                  >
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', wordBreak: 'break-word' }}>
                      {edu.degree}
                    </h4>
                    <span className="code-tag" style={{ fontSize: '0.7rem', flexShrink: 0 }}>
                      {edu.period}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.84rem', color: 'var(--cyan-light)', marginBottom: '8px' }}>
                    {edu.institution} | {edu.location}
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {edu.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Global Relocation & Availability Passport */}
        <ScrollReveal animation="throw-right" delayMs={100}>
          <div
            className="glass-panel"
            style={{
              padding: 'clamp(20px, 3.5vw, 32px)',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.06), var(--bg-card))',
              borderColor: 'rgba(6, 182, 212, 0.35)',
              height: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '22px',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '14px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(6, 182, 212, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Plane size={20} color="var(--cyan-light)" />
                </div>
                <div>
                  <h3 style={{ fontSize: 'clamp(1.15rem, 2vw, 1.25rem)', fontWeight: 800, color: 'var(--text-main)' }}>
                    Mobility & Availability Passport
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>
                    {mobility?.status || '● Immediate Relocation & Travel Ready'}
                  </div>
                </div>
              </div>

              {editMode && onEditMobility && (
                <button
                  onClick={onEditMobility}
                  style={{
                    background: 'rgba(6, 182, 212, 0.15)',
                    border: '1px solid var(--cyan-primary)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    color: 'var(--cyan-light)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Edit3 size={13} />
                  <span>Edit</span>
                </button>
              )}
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '20px' }}>
              {mobility?.summary ||
                'Available for immediate onboarding with zero relocation notice period. Fully equipped and experienced collaborating across international time zones.'}
            </p>

            {/* Highlights checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
              {(mobility?.highlights || [
                'Open to relocation in India (Bengaluru, NCR, Hyderabad, Pune, Mohali)',
                'Open to relocation in Dubai / UAE & international tech hubs',
                'Experienced with async global sprint delivery & PR code reviews',
              ]).map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle size={16} color="var(--emerald-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{h}</span>
                </div>
              ))}
            </div>

            {/* Languages section */}
            <div
              style={{
                background: 'var(--chip-bg)',
                borderRadius: '10px',
                padding: '14px 16px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  flexWrap: 'wrap',
                  gap: '6px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.78rem',
                    color: 'var(--text-dim)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <Languages size={14} color="var(--cyan-light)" />
                  <span>SPOKEN LANGUAGES:</span>
                </div>

                {editMode && onManageLanguages && (
                  <button
                    onClick={onManageLanguages}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--cyan-light)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 6px',
                    }}
                  >
                    <Edit3 size={11} />
                    <span>Edit Languages</span>
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                {personal.languages.map((lang) => (
                  <div key={lang.name} style={{ fontSize: '0.86rem' }}>
                    <strong style={{ color: 'var(--text-main)' }}>{lang.name}</strong>{' '}
                    <span style={{ color: 'var(--text-muted)' }}>({lang.proficiency})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
