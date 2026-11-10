import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { usePortfolio } from '../../context/PortfolioContext';
import type { ArchitectureNode } from '../../data/portfolioData';
import { X, Save, Layers } from 'lucide-react';

interface EditArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: ArchitectureNode | null;
}

interface ArchitectureFormInputs {
  title: string;
  subtitle: string;
  metricLabel: string;
  metricValue: string;
  description: string;
  patternsText: string;
}

export const EditArchitectureModal: React.FC<EditArchitectureModalProps> = ({
  isOpen,
  onClose,
  node,
}) => {
  const { updateArchitectureNode } = usePortfolio();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ArchitectureFormInputs>({
    defaultValues: {
      title: '',
      subtitle: '',
      metricLabel: '',
      metricValue: '',
      description: '',
      patternsText: '',
    },
  });

  useEffect(() => {
    if (isOpen && node) {
      reset({
        title: node.title,
        subtitle: node.subtitle,
        metricLabel: node.metrics?.label || (node as any).metricLabel || 'Performance Metric',
        metricValue: node.metrics?.value || (node as any).metric || 'Active',
        description: node.description || '',
        patternsText: (node.engineeringPatterns || (node as any).patterns || []).join('\n'),
      });
    }
  }, [isOpen, node, reset]);

  if (!isOpen || !node) return null;

  const onSubmit = (formData: ArchitectureFormInputs) => {
    const patterns = formData.patternsText
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    updateArchitectureNode(node.id, {
      title: formData.title,
      subtitle: formData.subtitle,
      metrics: {
        label: formData.metricLabel,
        value: formData.metricValue,
      },
      description: formData.description,
      engineeringPatterns: patterns.length > 0 ? patterns : node.engineeringPatterns,
    });

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        padding: '20px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 'clamp(20px, 4vw, 32px)',
          background: 'rgba(11, 16, 29, 0.98)',
          borderColor: 'rgba(6, 182, 212, 0.4)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(6, 182, 212, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={22} color="var(--cyan-light)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Edit Architecture Tier: {node.title}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Managed via <code>useForm</code> — updates the interactive system topology map.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                TIER TITLE
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: errors.title ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                SUBTITLE / TECH IMPLEMENTATION
              </label>
              <input
                {...register('subtitle', { required: 'Subtitle is required' })}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: errors.subtitle ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                TELEMETRY METRIC LABEL
              </label>
              <input
                {...register('metricLabel', { required: 'Label is required' })}
                placeholder="e.g. Auth Latency"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                TELEMETRY VALUE
              </label>
              <input
                {...register('metricValue', { required: 'Value is required' })}
                placeholder="e.g. < 2.4ms"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                ARCHITECTURE SPECIFICATION DESCRIPTION
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={3}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.9rem',
                  resize: 'none',
                  lineHeight: 1.6,
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                PRODUCTION STANDARDS & PATTERNS (ONE PER LINE)
              </label>
              <textarea
                {...register('patternsText', { required: 'Patterns are required' })}
                rows={4}
                placeholder="Deterministic route guarding...&#10;JWT token rotation...&#10;Audit log telemetry..."
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.9rem',
                  resize: 'none',
                  lineHeight: 1.6,
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: '10px 18px', fontSize: '0.88rem' }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ padding: '10px 22px', fontSize: '0.88rem' }}
            >
              <Save size={16} />
              <span>Save Architecture Tier</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
