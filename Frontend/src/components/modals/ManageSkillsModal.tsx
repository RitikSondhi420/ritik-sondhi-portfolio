import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePortfolio } from '../../context/PortfolioContext';
import { X, Plus, Trash2, Cpu } from 'lucide-react';

interface ManageSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SkillFormInputs {
  category: string;
  name: string;
  level: number;
  featured: boolean;
}

export const ManageSkillsModal: React.FC<ManageSkillsModalProps> = ({ isOpen, onClose }) => {
  const { data, addSkill, deleteSkill } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>(data.skillCategories[0]?.category || 'Frontend Development');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormInputs>({
    defaultValues: {
      category: data.skillCategories[0]?.category || 'Frontend Development',
      name: '',
      level: 90,
      featured: false,
    },
  });

  const currentLevel = watch('level', 90);

  if (!isOpen) return null;

  const currentCategoryData = data.skillCategories.find((c) => c.category === selectedCategory);

  const onSubmit = (formData: SkillFormInputs) => {
    addSkill(formData.category, {
      name: formData.name.trim(),
      level: Number(formData.level),
      featured: Boolean(formData.featured),
    });
    reset({
      category: formData.category,
      name: '',
      level: 90,
      featured: false,
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
            <Cpu size={22} color="var(--cyan-light)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
              Manage Technical Skills
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Add new technologies (like Python, Go, AWS) or tune your proficiency levels with <code>useForm</code>.
            </p>
          </div>
        </div>

        {/* Add Skill Form */}
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
            Add or Update Skill
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                CATEGORY
              </label>
              <select
                {...register('category', { required: true })}
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  register('category').onChange(e);
                }}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.85rem',
                }}
              >
                {data.skillCategories.map((c) => (
                  <option key={c.category} value={c.category}>
                    {c.category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', color: 'var(--text-dim)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                SKILL NAME
              </label>
              <input
                {...register('name', { required: 'Skill name is required' })}
                placeholder="e.g. Python, Golang, GraphQL..."
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: errors.name ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.85rem',
                }}
              />
              {errors.name && <span style={{ color: '#f43f5e', fontSize: '0.72rem' }}>{errors.name.message}</span>}
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  PROFICIENCY LEVEL: {currentLevel}%
                </label>
              </div>
              <input
                {...register('level')}
                type="range"
                min="50"
                max="100"
                step="1"
                style={{ width: '100%', accentColor: 'var(--cyan-primary)' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                {...register('featured')}
                type="checkbox"
                id="featured-checkbox"
                style={{ width: '16px', height: '16px', accentColor: 'var(--cyan-primary)' }}
              />
              <label htmlFor="featured-checkbox" style={{ fontSize: '0.85rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                Highlight as "Core" Skill
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{
              padding: '10px 16px',
              fontSize: '0.85rem',
              alignSelf: 'flex-start',
              marginTop: '4px',
            }}
          >
            <Plus size={16} />
            <span>Save Skill to {selectedCategory}</span>
          </button>
        </form>

        {/* Existing skills in selected category */}
        <div>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
            Existing Skills in {selectedCategory}:
          </h4>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {currentCategoryData?.skills.map((s) => (
              <div
                key={s.name}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.84rem',
                }}
              >
                <span style={{ color: '#fff', fontWeight: 500 }}>{s.name}</span>
                <span className="code-tag" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>
                  {s.level}%
                </span>
                <button
                  type="button"
                  onClick={() => deleteSkill(selectedCategory, s.name)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                  }}
                  title={`Delete ${s.name}`}
                >
                  <Trash2 size={13} color="#fb7185" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
