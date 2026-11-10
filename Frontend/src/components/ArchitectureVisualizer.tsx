import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import type { ArchitectureNode } from '../data/portfolioData';
import { ScrollReveal } from './ScrollReveal';
import {
  Layers,
  ShieldCheck,
  Database,
  GitPullRequest,
  Activity,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Edit3,
} from 'lucide-react';

interface ArchitectureVisualizerProps {
  onEditNode?: (node: ArchitectureNode) => void;
}

export const ArchitectureVisualizer: React.FC<ArchitectureVisualizerProps> = ({ onEditNode }) => {
  const { data, editMode } = usePortfolio();
  const nodes = data.architectureNodes;
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[2]?.id || 'service');

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const renderIcon = (type: ArchitectureNode['icon']) => {
    switch (type) {
      case 'client':
        return <Cpu size={22} color="var(--cyan-light)" />;
      case 'gateway':
        return <ShieldCheck size={22} color="#34d399" />;
      case 'service':
        return <Layers size={22} color="var(--purple-light)" />;
      case 'database':
        return <Database size={22} color="#38bdf8" />;
      case 'cicd':
        return <GitPullRequest size={22} color="#f43f5e" />;
      default:
        return <Layers size={22} color="var(--cyan-light)" />;
    }
  };

  return (
    <section
      id="architecture"
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
        <div style={{ marginBottom: '40px', maxWidth: '820px' }}>
          <div className="glass-pill" style={{ marginBottom: '14px' }}>
            <Layers size={14} color="var(--cyan-light)" />
            <span style={{ color: 'var(--cyan-light)', fontFamily: 'var(--font-mono)' }}>
              INTERACTIVE SYSTEM ARCHITECTURE PLAYGROUND
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
            How I Design & Decouple{' '}
            <span className="gradient-text-cyan">Resilient Microservices</span>
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.65 }}>
            Click through each architectural tier below to inspect the service abstraction layers,
            security guards, data pipelines, and continuous integration gates used in production.
          </p>
        </div>
      </ScrollReveal>

      {/* Interactive Flow Diagram Nodes */}
      <ScrollReveal animation="throw-up" delayMs={100}>
        <div
          className="glass-panel"
          style={{
            padding: 'clamp(18px, 3vw, 28px) clamp(14px, 2.5vw, 24px)',
            marginBottom: '28px',
            background: 'var(--bg-card)',
            borderColor: 'rgba(45, 212, 191, 0.2)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
              <Activity size={16} color="var(--cyan-light)" />
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>LIVE SYSTEM TOPOLOGY MAP</span>
            </div>

            <span
              className="code-tag"
              style={{ color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', fontSize: '0.72rem' }}
            >
              ● Telemetry Synced
            </span>
          </div>

          {/* Nodes Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))',
              gap: '14px',
              position: 'relative',
            }}
          >
            {nodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(13, 148, 136, 0.15), rgba(124, 58, 237, 0.15))'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1px solid var(--cyan-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: '14px',
                    padding: '16px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    boxShadow: isSelected ? '0 0 20px rgba(45, 212, 191, 0.25)' : 'none',
                    transition: 'all 0.25s ease',
                    transform: isSelected ? 'translateY(-3px)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {renderIcon(node.icon)}
                    </div>

                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: isSelected ? 'var(--cyan-light)' : 'var(--text-dim)',
                        textAlign: 'right',
                        wordBreak: 'break-word',
                      }}
                    >
                      {node.metrics?.value || (node as any).metric || 'Active'}
                    </span>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '3px' }}>
                      {node.title}
                    </h4>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {node.subtitle}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      color: isSelected ? 'var(--cyan-light)' : 'var(--text-dim)',
                      fontFamily: 'var(--font-mono)',
                      marginTop: 'auto',
                    }}
                  >
                    <span>{isSelected ? '● ACTIVE TIER' : 'Inspect'}</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* Selected Node Deep-Dive Card */}
      {selectedNode && (
        <ScrollReveal animation="pop-in" delayMs={150}>
          <div
            className="glass-panel"
            style={{
              padding: 'clamp(20px, 3.5vw, 32px)',
              borderColor: 'rgba(167, 139, 250, 0.25)',
              background: 'var(--bg-card)',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.15), rgba(124, 58, 237, 0.15))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(45, 212, 191, 0.3)',
                    flexShrink: 0,
                  }}
                >
                  {renderIcon(selectedNode.icon)}
                </div>

                <div>
                  <h3 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.4rem)', fontWeight: 800, color: 'var(--text-main)' }}>
                    {selectedNode.title} Specifications
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--cyan-light)' }}>
                    {selectedNode.subtitle}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div
                  className="code-tag"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    background: 'rgba(167, 139, 250, 0.1)',
                    borderColor: 'rgba(167, 139, 250, 0.25)',
                    color: 'var(--purple-light)',
                  }}
                >
                  {(selectedNode.metrics?.label || (selectedNode as any).metricLabel || 'Metric')}:{' '}
                  {(selectedNode.metrics?.value || (selectedNode as any).metric || 'Active')}
                </div>

                {editMode && onEditNode && (
                  <button
                    onClick={() => onEditNode(selectedNode)}
                    style={{
                      background: 'rgba(45, 212, 191, 0.12)',
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
                    <span>Edit Tier</span>
                  </button>
                )}
              </div>
            </div>

            <p style={{ fontSize: '0.96rem', color: 'var(--text-main)', lineHeight: 1.65, marginBottom: '22px' }}>
              {selectedNode.description}
            </p>

            <div>
              <h4
                style={{
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: 'var(--text-dim)',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '12px',
                }}
              >
                Production Engineering Standards Applied:
              </h4>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                  gap: '10px',
                }}
              >
                {(selectedNode.engineeringPatterns || (selectedNode as any).patterns || []).map((pattern: string, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.025)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <CheckCircle2 size={15} color="var(--cyan-light)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>{pattern}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}
    </section>
  );
};
