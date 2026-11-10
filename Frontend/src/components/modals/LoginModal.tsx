import React from 'react';
import { useForm } from 'react-hook-form';
import { usePortfolio } from '../../context/PortfolioContext';
import { Lock, User, Key, X, AlertCircle, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoginFormInputs {
  username: string;
  password: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = usePortfolio();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (formData: LoginFormInputs) => {
    const success = await login(formData.username, formData.password);
    if (success) {
      onClose();
    } else {
      setError('root', {
        type: 'manual',
        message: 'Invalid administrative credentials. Please verify your username and password.',
      });
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
        background: 'rgba(5, 8, 15, 0.8)',
        backdropFilter: 'blur(12px)',
        padding: '16px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: 'clamp(20px, 4vw, 32px)',
          background: 'rgba(11, 16, 29, 0.95)',
          borderColor: 'rgba(6, 182, 212, 0.4)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(6, 182, 212, 0.2)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
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
            padding: '4px',
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
            }}
          >
            <ShieldCheck size={26} color="#fff" />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
            Portfolio Admin Access
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Log in to enable <strong>Edit Mode</strong> and modify your live portfolio details.
          </p>
        </div>

        {/* Form managed via useForm */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {errors.root && (
            <div
              style={{
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                fontSize: '0.82rem',
                color: '#fb7185',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{errors.root.message}</span>
            </div>
          )}

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                color: 'var(--text-dim)',
                marginBottom: '6px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              USERNAME / EMAIL
            </label>
            <div style={{ position: 'relative' }}>
              <User
                size={16}
                color="var(--text-dim)"
                style={{ position: 'absolute', top: '12px', left: '12px' }}
              />
              <input
                {...register('username', { required: 'Username is required' })}
                type="text"
                placeholder="Enter admin username or email"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: errors.username ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '10px 12px 10px 38px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>
            {errors.username && (
              <span style={{ fontSize: '0.75rem', color: '#f43f5e', marginTop: '4px', display: 'block' }}>
                {errors.username.message}
              </span>
            )}
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                color: 'var(--text-dim)',
                marginBottom: '6px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Key
                size={16}
                color="var(--text-dim)"
                style={{ position: 'absolute', top: '12px', left: '12px' }}
              />
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                placeholder="••••••••"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: errors.password ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '10px 12px 10px 38px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>
            {errors.password && (
              <span style={{ fontSize: '0.75rem', color: '#f43f5e', marginTop: '4px', display: 'block' }}>
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{
              justifyContent: 'center',
              padding: '12px',
              marginTop: '8px',
              width: '100%',
            }}
          >
            <Lock size={16} />
            <span>Unlock Edit Mode</span>
          </button>
        </form>
      </div>
    </div>
  );
};
