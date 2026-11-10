import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { usePortfolio } from '../../context/PortfolioContext';
import { X, Save, Plane } from 'lucide-react';

interface EditMobilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MobilityFormInputs {
  status: string;
  summary: string;
  highlightsText: string;
}

export const EditMobilityModal: React.FC<EditMobilityModalProps> = ({ isOpen, onClose }) => {
  const { data, updateMobility } = usePortfolio();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MobilityFormInputs>({
    defaultValues: {
      status: data.mobility?.status || '● Immediate Relocation & Travel Ready',
      summary: data.mobility?.summary || '',
      highlightsText: data.mobility?.highlights?.join('\n') || '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        status: data.mobility?.status || '● Immediate Relocation & Travel Ready',
        summary: data.mobility?.summary || '',
        highlightsText: data.mobility?.highlights?.join('\n') || '',
      });
    }
  }, [isOpen, data.mobility, reset]);

  if (!isOpen) return null;

  const onSubmit = (formData: MobilityFormInputs) => {
    const highlights = formData.highlightsText
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    updateMobility({
      status: formData.status,
      summary: formData.summary,
      highlights: highlights.length > 0 ? highlights : data.mobility.highlights,
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
          maxWidth: '640px',
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
            <Plane size={22} color="var(--cyan-light)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Edit Mobility & Availability Passport
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Managed via <code>useForm</code> — updates relocation availability and target hubs.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
              MOBILITY BADGE STATUS
            </label>
            <input
              {...register('status', { required: 'Status is required' })}
              placeholder="e.g. ● Immediate Relocation & Travel Ready"
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: errors.status ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
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
              MOBILITY SUMMARY DESCRIPTION
            </label>
            <textarea
              {...register('summary', { required: 'Summary is required' })}
              rows={3}
              placeholder="Available for immediate onboarding with zero relocation notice period..."
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: errors.summary ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
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

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
              MOBILITY HIGHLIGHTS (ONE PER LINE)
            </label>
            <textarea
              {...register('highlightsText', { required: 'Highlights are required' })}
              rows={4}
              placeholder="Open to relocation in India (Bengaluru, NCR, Hyderabad, Pune, Mohali)&#10;Open to relocation in Dubai / UAE & international tech hubs&#10;Experienced with async global sprint delivery..."
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.04)',
                border: errors.highlightsText ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
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
              <span>Save Mobility Passport</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
