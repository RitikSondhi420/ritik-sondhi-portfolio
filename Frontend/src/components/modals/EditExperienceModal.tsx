import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { usePortfolio } from '../../context/PortfolioContext';
import type { Experience } from '../../data/portfolioData';
import { X, Save, Briefcase, Trash2 } from 'lucide-react';

interface EditExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience?: Experience | null; // If null, mode is "Add"
}

interface ExperienceFormInputs {
  company: string;
  role: string;
  period: string;
  location: string;
  type: string;
  summary: string;
  achievementsText: string;
  techStackText: string;
  architectureHighlights: string;
}

export const EditExperienceModal: React.FC<EditExperienceModalProps> = ({
  isOpen,
  onClose,
  experience,
}) => {
  const { updateExperience, addExperience, deleteExperience } = usePortfolio();

  const isEditing = Boolean(experience);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormInputs>({
    defaultValues: {
      company: '',
      role: '',
      period: '',
      location: '',
      type: 'Remote',
      summary: '',
      achievementsText: '',
      techStackText: '',
      architectureHighlights: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (experience) {
        reset({
          company: experience.company,
          role: experience.role,
          period: experience.period,
          location: experience.location,
          type: experience.type,
          summary: experience.summary,
          achievementsText: experience.achievements.join('\n'),
          techStackText: experience.techStack.join(', '),
          architectureHighlights: experience.architectureHighlights,
        });
      } else {
        reset({
          company: '',
          role: '',
          period: '',
          location: '',
          type: 'Remote',
          summary: '',
          achievementsText: '',
          techStackText: '',
          architectureHighlights: '',
        });
      }
    }
  }, [isOpen, experience, reset]);

  if (!isOpen) return null;

  const onSubmit = (formData: ExperienceFormInputs) => {
    const achievements = formData.achievementsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const techStack = formData.techStackText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      company: formData.company,
      role: formData.role,
      period: formData.period,
      location: formData.location,
      type: formData.type,
      summary: formData.summary,
      achievements: achievements.length > 0 ? achievements : [formData.summary],
      techStack: techStack.length > 0 ? techStack : ['TypeScript', 'React'],
      architectureHighlights: formData.architectureHighlights,
    };

    if (isEditing && experience) {
      updateExperience(experience.id, payload);
    } else {
      addExperience(payload);
    }

    onClose();
  };

  const handleDelete = () => {
    if (experience && window.confirm(`Are you sure you want to delete ${experience.company}?`)) {
      deleteExperience(experience.id);
      onClose();
    }
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
            <Briefcase size={22} color="var(--purple-light)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              {isEditing ? `Edit Experience: ${experience?.company}` : 'Add New Role & Experience'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Managed via <code>useForm</code> — updates your career timeline and AI Copilot knowledge base.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                COMPANY NAME
              </label>
              <input
                {...register('company', { required: 'Company is required' })}
                placeholder="e.g. Propertise"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: errors.company ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
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
                ROLE TITLE
              </label>
              <input
                {...register('role', { required: 'Role is required' })}
                placeholder="e.g. Full Stack Developer"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: errors.role ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
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
                TIMELINE PERIOD
              </label>
              <input
                {...register('period', { required: 'Period is required' })}
                placeholder="e.g. Mar 2025 to Present"
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
                LOCATION & TYPE
              </label>
              <input
                {...register('location', { required: 'Location is required' })}
                placeholder="e.g. Dubai (Remote)"
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
                HIGH-LEVEL ROLE SUMMARY
              </label>
              <input
                {...register('summary', { required: 'Summary is required' })}
                placeholder="Brief summary of engineering impact..."
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
                SYSTEM ARCHITECTURE HIGHLIGHT
              </label>
              <textarea
                {...register('architectureHighlights', { required: 'Architecture is required' })}
                rows={2}
                placeholder="Explain the architectural pattern (e.g. Decoupled billing service abstraction layer)..."
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
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                KEY PRODUCTION ACHIEVEMENTS (ONE PER LINE)
              </label>
              <textarea
                {...register('achievementsText', { required: 'Achievements are required' })}
                rows={4}
                placeholder="Designed backend service abstraction layers...&#10;Built automated CI/CD pipelines with Docker...&#10;Conducted regular peer code reviews..."
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
                TECHNOLOGY STACK (COMMA SEPARATED)
              </label>
              <input
                {...register('techStackText', { required: 'Tech stack is required' })}
                placeholder="e.g. NestJS, TypeScript, PostgreSQL, Docker, CI/CD"
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
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#fb7185',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                }}
              >
                <Trash2 size={16} />
                <span>Delete Role</span>
              </button>
            ) : <div />}

            <div style={{ display: 'flex', gap: '12px' }}>
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
                <span>{isEditing ? 'Update Role' : 'Add Role'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
