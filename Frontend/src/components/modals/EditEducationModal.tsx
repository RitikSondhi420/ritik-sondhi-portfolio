import React from 'react';
import { useForm } from 'react-hook-form';
import { usePortfolio } from '../../context/PortfolioContext';
import { X, Plus, Trash2, GraduationCap } from 'lucide-react';

interface EditEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EducationFormInputs {
  degree: string;
  institution: string;
  period: string;
  location: string;
  details: string;
}

export const EditEducationModal: React.FC<EditEducationModalProps> = ({ isOpen, onClose }) => {
  const { data, addEducationItem, deleteEducationItem } = usePortfolio();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormInputs>({
    defaultValues: {
      degree: '',
      institution: 'Chitkara University',
      period: '',
      location: 'Baddi, Himachal Pradesh',
      details: '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = (formData: EducationFormInputs) => {
    addEducationItem({
      id: 'edu-' + Date.now(),
      degree: formData.degree.trim(),
      institution: formData.institution.trim(),
      period: formData.period.trim(),
      location: formData.location.trim(),
      details: formData.details.trim(),
    });
    reset({
      degree: '',
      institution: 'Chitkara University',
      period: '',
      location: 'Baddi, Himachal Pradesh',
      details: '',
    });
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
          borderColor: 'rgba(139, 92, 246, 0.4)',
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
              background: 'rgba(139, 92, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GraduationCap size={22} color="var(--purple-light)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Manage Academic Credentials
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Add or remove degrees and certifications with <code>useForm</code>.
            </p>
          </div>
        </div>

        {/* Add Degree Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
            Add Degree or Certification
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                DEGREE / TITLE
              </label>
              <input
                {...register('degree', { required: 'Degree title is required' })}
                placeholder="e.g. Master of Science..."
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: errors.degree ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                INSTITUTION / UNIVERSITY
              </label>
              <input
                {...register('institution', { required: 'Institution is required' })}
                placeholder="e.g. Chitkara University"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: errors.institution ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                PERIOD
              </label>
              <input
                {...register('period', { required: 'Period is required' })}
                placeholder="e.g. Aug 2021 to Aug 2023"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: errors.period ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                LOCATION
              </label>
              <input
                {...register('location', { required: 'Location is required' })}
                placeholder="e.g. Baddi, Himachal Pradesh"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: errors.location ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                FOCUS & DETAILS
              </label>
              <textarea
                {...register('details', { required: 'Details are required' })}
                rows={2}
                placeholder="Advanced software engineering, distributed system design..."
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: errors.details ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.85rem',
                  resize: 'none',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{
              padding: '10px 18px',
              fontSize: '0.85rem',
              alignSelf: 'flex-start',
              marginTop: '4px',
            }}
          >
            <Plus size={16} />
            <span>Add Credential</span>
          </button>
        </form>

        {/* Existing Degrees List */}
        <div>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
            Current Academic Credentials:
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.education.map((edu) => (
              <div
                key={edu.degree}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                    {edu.degree}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--cyan-light)' }}>
                    {edu.institution} — {edu.period} ({edu.location})
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteEducationItem(edu.id || edu.degree)}
                  style={{
                    background: 'rgba(244, 63, 94, 0.1)',
                    border: '1px solid rgba(244, 63, 94, 0.25)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    color: '#fb7185',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.78rem',
                  }}
                  title="Delete Credential"
                >
                  <Trash2 size={13} />
                  <span>Remove</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
