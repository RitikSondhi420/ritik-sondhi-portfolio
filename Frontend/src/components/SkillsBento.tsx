import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ScrollReveal } from './ScrollReveal';
import { Cpu, Search, Code2, Server, Database, GitBranch, Bot, Settings2 } from 'lucide-react';

interface SkillsBentoProps {
  onManageSkills?: () => void;
}

export const SkillsBento: React.FC<SkillsBentoProps> = ({ onManageSkills }) => {
  const { data, editMode } = usePortfolio();
  const { skillCategories } = data;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', ...skillCategories.map((c) => c.category)];

  const filteredCategories = skillCategories
    .map((cat) => {
      const filteredSkills = cat.skills.filter((skill) =>
        skill.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return {
        ...cat,
        skills: filteredSkills,
      };
    })
    .filter((cat) => {
      if (selectedCategory !== 'All' && cat.category !== selectedCategory) return false;
      return cat.skills.length > 0;
    });

  const getCategoryIcon = (category: string) => {
    if (category.includes('Frontend')) return <Code2 size={18} color="var(--cyan-light)" />;
    if (category.includes('Backend')) return <Server size={18} color="#c084fc" />;
    if (category.includes('Database')) return <Database size={18} color="#38bdf8" />;
    if (category.includes('DevOps')) return <GitBranch size={18} color="#34d399" />;
    return <Bot size={18} color="#f43f5e" />;
  };

  return (
    <section
      id="skills"
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
      {/* Header */}
      <ScrollReveal animation="throw-down">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '36px',
          }}
        >
          <div style={{ maxWidth: '800px' }}>
            <div className="glass-pill" style={{ marginBottom: '14px' }}>
              <Cpu size={14} color="var(--cyan-light)" />
              <span style={{ color: 'var(--cyan-light)', fontFamily: 'var(--font-mono)' }}>
                TECHNICAL ARSENAL & TOOLING
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
              Technologies, Frameworks &{' '}
              <span className="gradient-text-cyan">Engineering Standards</span>
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.65 }}>
              Curated stack optimized for low-latency responsiveness, high-density data visualization,
              and robust enterprise microservices.
            </p>
          </div>

          {/* Manage Skills Button in Edit Mode */}
          {editMode && onManageSkills && (
            <button
              onClick={onManageSkills}
              className="btn-primary"
              style={{
                padding: '10px 18px',
                fontSize: '0.85rem',
              }}
            >
              <Settings2 size={16} />
              <span>Manage & Add Skills</span>
            </button>
          )}
        </div>
      </ScrollReveal>

      {/* Filter and Search Bar */}
      <ScrollReveal animation="pop-in" delayMs={60}>
        <div className="skills-filter-container">
          {/* Category Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    background: isSelected ? 'rgba(6, 182, 212, 0.2)' : 'var(--chip-bg)',
                    border: isSelected ? '1px solid var(--cyan-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: '9999px',
                    padding: '7px 14px',
                    color: isSelected ? 'var(--cyan-light)' : 'var(--text-muted)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Live Search Input */}
          <div
            className="skills-search-bar"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9999px',
              padding: '7px 14px',
              width: '260px',
              boxSizing: 'border-box',
            }}
          >
            <Search size={14} color="var(--text-dim)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter skills (e.g. Python, NestJS)..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: '0.84rem',
                width: '100%',
              }}
            />
          </div>
        </div>
      </ScrollReveal>

      {/* Skills Grid Bento */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '20px',
          width: '100%',
        }}
      >
        {filteredCategories.map((catGroup, idx) => (
          <ScrollReveal key={catGroup.category} animation="throw-up" delayMs={idx * 70}>
            <div
              className="glass-panel"
              style={{
                padding: 'clamp(18px, 3vw, 24px)',
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--bg-card)',
                height: '100%',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '18px',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '12px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'var(--chip-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {getCategoryIcon(catGroup.category)}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {catGroup.category}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {catGroup.skills.map((skill) => (
                  <div key={skill.name}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '6px',
                        fontSize: '0.86rem',
                        gap: '6px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{skill.name}</span>
                        {skill.featured && (
                          <span
                            className="code-tag"
                            style={{
                              fontSize: '0.65rem',
                              padding: '1px 5px',
                              background: 'rgba(6, 182, 212, 0.15)',
                            }}
                          >
                            Core
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.74rem',
                          color: 'var(--cyan-light)',
                          flexShrink: 0,
                        }}
                      >
                        {skill.level}%
                      </span>
                    </div>

                    {/* Level Bar */}
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${skill.level}%`,
                          height: '100%',
                          background:
                            skill.level >= 92
                              ? 'linear-gradient(90deg, #06b6d4, #8b5cf6)'
                              : 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                          borderRadius: '3px',
                          transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
