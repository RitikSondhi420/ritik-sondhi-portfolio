import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Bot, Menu, X, Send, Lock, Edit3, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  onOpenCopilot: () => void;
  copilotActive: boolean;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCopilot, copilotActive, onOpenLogin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, editMode, toggleEditMode, theme, toggleTheme } = usePortfolio();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Overview', href: '#overview' },
    { name: 'Experience', href: '#experience' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'Skills', href: '#skills' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className="navbar-wrapper"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? '10px 16px' : '16px 16px',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        className="navbar-inner"
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'var(--header-bg)' : 'var(--header-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '9999px',
          padding: '8px 16px',
          boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.1)',
          gap: '12px',
        }}
      >
        {/* Brand Monogram */}
        <a
          href="#overview"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'inherit',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.95rem',
              color: '#ffffff',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)',
              flexShrink: 0,
            }}
          >
            RS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.3px', color: 'var(--text-main)' }}>
              Ritik Sondhi
            </span>
            <span
              className="navbar-brand-sub"
              style={{ fontSize: '0.68rem', color: 'var(--cyan-light)', fontFamily: 'var(--font-mono)' }}
            >
              Full Stack • AI Systems
            </span>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '24px',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={{
                textDecoration: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                fontWeight: 500,
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cyan-light)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--chip-bg)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9999px',
              padding: '7px 12px',
              color: 'var(--text-main)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.25s ease',
            }}
            title={theme === 'dark' ? 'Switch to Peaceful Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle light and dark theme"
          >
            {theme === 'dark' ? (
              <Sun size={15} color="#f59e0b" />
            ) : (
              <Moon size={15} color="#7c3aed" />
            )}
            <span className="theme-toggle-label" style={{ fontSize: '0.78rem' }}>
              {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
          </button>

          {/* Admin Login / Edit Mode Toggle Button (Desktop & Tablet) */}
          <div className="nav-desktop-actions" style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
            {isLoggedIn ? (
              <button
                onClick={toggleEditMode}
                style={{
                  background: editMode ? 'rgba(6, 182, 212, 0.2)' : 'var(--chip-bg)',
                  border: editMode ? '1px solid var(--cyan-primary)' : '1px solid var(--border-subtle)',
                  borderRadius: '9999px',
                  padding: '7px 14px',
                  color: editMode ? 'var(--cyan-light)' : 'var(--text-main)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
                title="Toggle Edit / View Mode"
              >
                <Edit3 size={13} />
                <span>{editMode ? 'Edit Mode: ON' : 'View Mode'}</span>
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                style={{
                  background: 'var(--chip-bg)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '9999px',
                  padding: '7px 14px',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
                title="Admin Login to Edit Portfolio"
              >
                <Lock size={13} color="var(--cyan-light)" />
                <span>Login</span>
              </button>
            )}

            {/* Agentic AI Copilot Status Button */}
            <button
              onClick={onOpenCopilot}
              style={{
                background: copilotActive
                  ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(139, 92, 246, 0.25))'
                  : 'var(--chip-bg)',
                border: copilotActive ? '1px solid var(--cyan-primary)' : '1px solid var(--border-subtle)',
                borderRadius: '9999px',
                padding: '8px 16px',
                color: 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                boxShadow: copilotActive ? '0 0 15px rgba(6, 182, 212, 0.4)' : 'none',
                transition: 'all 0.25s ease',
              }}
              title="Interact with Ritik's Autonomous Career Agent"
            >
              <Bot size={16} color={copilotActive ? 'var(--cyan-light)' : '#a78bfa'} />
              <span className="status-beacon" />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                AI Copilot
              </span>
            </button>
          </div>

          {/* Contact Quick Ping (Always visible & responsive) */}
          <a
            href="#contact"
            className="navbar-hire-btn"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: 600,
              padding: '7px 14px',
              borderRadius: '9999px',
              boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)',
              transition: 'transform 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <Send size={13} />
            <span className="hire-btn-text">Hire Me</span>
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'var(--chip-bg)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'none',
              padding: '7px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="mobile-menu-btn"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer"
          style={{
            maxWidth: '1240px',
            margin: '8px auto 0',
            background: 'var(--header-bg)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: 'var(--text-main)',
                fontSize: '0.98rem',
                fontWeight: 500,
                padding: '10px 4px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>{link.name}</span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>→</span>
            </a>
          ))}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCopilot();
              }}
              style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))',
                border: '1px solid var(--cyan-primary)',
                color: 'var(--text-main)',
                padding: '11px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <Bot size={16} color="var(--cyan-light)" />
              <span>AI Copilot</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (isLoggedIn) {
                  toggleEditMode();
                } else {
                  onOpenLogin();
                }
              }}
              style={{
                background: 'var(--chip-bg)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                padding: '11px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              {isLoggedIn ? <Edit3 size={15} /> : <Lock size={15} />}
              <span>{isLoggedIn ? (editMode ? 'Edit Mode' : 'View Mode') : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (min-width: 992px) {
          .desktop-nav {
            display: flex !important;
          }
          .nav-desktop-actions {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        @media (max-width: 991px) {
          .mobile-menu-btn {
            display: flex !important;
          }
        }
        @media (max-width: 520px) {
          .theme-toggle-label {
            display: none !important;
          }
        }
        @media (max-width: 420px) {
          .navbar-brand-sub {
            display: none !important;
          }
          .hire-btn-text {
            display: none !important;
          }
          .navbar-hire-btn {
            padding: 7px 10px !important;
          }
        }
      `}</style>
    </header>
  );
};
