import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ShieldCheck, Eye, Edit3, RotateCcw, LogOut, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

export const AdminBar: React.FC = () => {
  const { isLoggedIn, editMode, toggleEditMode, logout, resetToDefaults, backendConnected, refreshFromBackend } = usePortfolio();
  const [minimized, setMinimized] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    await refreshFromBackend();
    setTimeout(() => setSyncing(false), 600);
  };

  if (!isLoggedIn) return null;

  return (
    <div
      className="admin-bar-root"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 140,
        maxWidth: '860px',
        width: 'calc(100% - 32px)',
        background: 'rgba(11, 16, 29, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: editMode ? '1.5px solid var(--cyan-primary)' : '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '9999px',
        padding: minimized ? '6px 16px' : '8px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        boxShadow: editMode
          ? '0 12px 35px rgba(0, 0, 0, 0.7), 0 0 25px rgba(6, 182, 212, 0.35)'
          : '0 12px 35px rgba(0, 0, 0, 0.6)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      aria-label="Admin control panel"
    >
      {/* Status indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: editMode
              ? 'linear-gradient(135deg, #0d9488, #7c3aed)'
              : 'rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: editMode ? '0 0 10px rgba(45, 212, 191, 0.5)' : 'none',
            flexShrink: 0,
          }}
        >
          <ShieldCheck size={16} color="#fff" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>
              Admin Session
            </span>
            <span
              className="admin-status-badge"
              style={{
                fontSize: '0.68rem',
                padding: '1px 6px',
                borderRadius: '9999px',
                background: backendConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                color: backendConnected ? '#34d399' : '#facc15',
                border: backendConnected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
              }}
            >
              {backendConnected ? '⚡ NestJS API' : '⚡ Local Cache'}
            </span>
          </div>
          <span
            className="admin-status-sub"
            style={{
              fontSize: '0.72rem',
              color: editMode ? 'var(--cyan-light)' : 'var(--text-muted)',
              fontWeight: 600,
              display: 'block',
            }}
          >
            ● {editMode ? 'Edit Mode ON' : 'View Mode ON'}
          </span>
        </div>
      </div>

      {/* Action switches */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        {!minimized && (
          <>
            {/* Toggle Mode Button */}
            <button
              onClick={toggleEditMode}
              style={{
                background: editMode
                  ? 'linear-gradient(135deg, #0d9488, #0284c7)'
                  : 'rgba(255, 255, 255, 0.06)',
                border: editMode ? 'none' : '1px solid var(--border-subtle)',
                borderRadius: '9999px',
                padding: '6px 14px',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s ease',
                boxShadow: editMode ? '0 0 12px rgba(45, 212, 191, 0.4)' : 'none',
              }}
            >
              {editMode ? <Edit3 size={13} /> : <Eye size={13} />}
              <span className="admin-btn-label">{editMode ? 'View' : 'Edit'}</span>
            </button>

            {/* Sync from Backend button */}
            <button
              onClick={handleSync}
              disabled={syncing}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '9999px',
                padding: '6px 12px',
                color: 'var(--text-dim)',
                fontSize: '0.76rem',
                cursor: syncing ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Sync latest records from NestJS Backend"
            >
              <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
              <span className="admin-btn-label">{syncing ? 'Syncing...' : 'Sync'}</span>
            </button>

            {/* Reset defaults button */}
            <button
              onClick={async () => {
                if (window.confirm('Reset all portfolio details back to the default resume specifications?')) {
                  setSyncing(true);
                  try {
                    await resetToDefaults();
                  } finally {
                    setTimeout(() => setSyncing(false), 500);
                  }
                }
              }}
              disabled={syncing}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '9999px',
                padding: '6px 12px',
                color: 'var(--text-dim)',
                fontSize: '0.76rem',
                cursor: syncing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                opacity: syncing ? 0.6 : 1,
              }}
              title="Restore original resume data from database"
            >
              <RotateCcw size={12} className={syncing ? 'animate-spin' : ''} />
              <span className="admin-btn-label">{syncing ? 'Resetting...' : 'Reset'}</span>
            </button>

            {/* Logout button */}
            <button
              onClick={logout}
              style={{
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.28)',
                borderRadius: '9999px',
                padding: '6px 12px',
                color: '#fb7185',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Logout from admin session"
            >
              <LogOut size={12} />
              <span className="admin-btn-label">Logout</span>
            </button>
          </>
        )}

        {/* Minimize / Expand Toggle */}
        <button
          onClick={() => setMinimized(!minimized)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
          }}
          title={minimized ? 'Expand dock' : 'Minimize dock'}
        >
          {minimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .admin-bar-root {
            left: 12px !important;
            right: 12px !important;
            bottom: 12px !important;
            width: auto !important;
            transform: none !important;
            padding: 8px 12px !important;
          }
          .admin-status-sub {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .admin-status-badge {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
