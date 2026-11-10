import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { usePortfolio } from '../../context/PortfolioContext';
import type { PersonalData } from '../../data/portfolioData';
import { X, Save, UserCheck } from 'lucide-react';

interface EditPersonalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PersonalFormInputs = Omit<PersonalData, 'languages' | 'metrics'>;

export const EditPersonalModal: React.FC<EditPersonalModalProps> = ({ isOpen, onClose }) => {
  const { data, updatePersonal } = usePortfolio();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PersonalFormInputs>({
    defaultValues: {
      name: data.personal.name,
      title: data.personal.title,
      experienceYears: data.personal.experienceYears,
      location: data.personal.location,
      relocation: data.personal.relocation,
      email: data.personal.email,
      phone: data.personal.phone,
      linkedin: data.personal.linkedin,
      summary: data.personal.summary,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: data.personal.name,
        title: data.personal.title,
        experienceYears: data.personal.experienceYears,
        location: data.personal.location,
        relocation: data.personal.relocation,
        email: data.personal.email,
        phone: data.personal.phone,
        linkedin: data.personal.linkedin,
        summary: data.personal.summary,
      });
    }
  }, [isOpen, data.personal, reset]);

  if (!isOpen) return null;

  const onSubmit = (formData: PersonalFormInputs) => {
    updatePersonal(formData);
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
            <UserCheck size={22} color="var(--cyan-light)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Edit Profile & Bio
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Managed via <code>useForm</code> — updates persist directly to your portfolio.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                FULL NAME
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: errors.name ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
              />
              {errors.name && <span style={{ color: '#f43f5e', fontSize: '0.75rem' }}>{errors.name.message}</span>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                TITLE / HEADLINE
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
              {errors.title && <span style={{ color: '#f43f5e', fontSize: '0.75rem' }}>{errors.title.message}</span>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                LOCATION
              </label>
              <input
                {...register('location', { required: 'Location is required' })}
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
                RELOCATION AVAILABILITY
              </label>
              <input
                {...register('relocation', { required: 'Relocation text is required' })}
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
                EMAIL
              </label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: errors.email ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
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
                PHONE NUMBER
              </label>
              <input
                {...register('phone', { required: 'Phone is required' })}
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
                LINKEDIN URL
              </label>
              <input
                {...register('linkedin')}
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
                PROFESSIONAL BIO & SUMMARY
              </label>
              <textarea
                {...register('summary', { required: 'Summary is required' })}
                rows={4}
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
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
