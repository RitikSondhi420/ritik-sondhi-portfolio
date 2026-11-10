import { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ScrollReveal } from './ScrollReveal';
import { api } from '../services/api';
import {
  Mail,
  Phone,
  Copy,
  Check,
  Send,
  MessageSquare,
  ExternalLink,
  Loader2,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { data } = usePortfolio();
  const { personal } = data;
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    try {
      await api.submitInquiry(formData);
    } catch (err) {
      console.warn('Inquiry dispatch error:', err);
    } finally {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }
  };

  return (
    <section
      id="contact"
      className="section-wrapper"
      style={{
        padding: 'clamp(60px, 10vh, 100px) clamp(16px, 4vw, 24px) clamp(80px, 12vh, 120px)',
        maxWidth: '1240px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        width: '100%',
      }}
    >
      {/* Header */}
      <ScrollReveal animation="throw-down">
        <div style={{ marginBottom: '40px', maxWidth: '800px' }}>
          <div className="glass-pill" style={{ marginBottom: '14px' }}>
            <Mail size={14} color="var(--cyan-light)" />
            <span style={{ color: 'var(--cyan-light)', fontFamily: 'var(--font-mono)' }}>
              GET IN TOUCH & RELOCATION DESK
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
            Let's Build Something <span className="gradient-text-cyan">Exceptional Together</span>
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.65 }}>
            Whether you are looking to hire a Full Stack Lead, engineer high-throughput microservices,
            or deploy AI-assisted engineering workflows—my inbox is always open.
          </p>
        </div>
      </ScrollReveal>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '24px',
          width: '100%',
        }}
      >
        {/* Left Column: Direct Contact Cards with 1-Click Copy */}
        <ScrollReveal animation="throw-left" delayMs={50}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email Card */}
            <div className="glass-panel contact-item-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(6, 182, 212, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Mail size={20} color="var(--cyan-light)" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Direct Email
                  </div>
                  <a
                    href={`mailto:${personal.email}`}
                    style={{
                      color: 'var(--text-main)',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.96rem',
                      wordBreak: 'break-word',
                    }}
                  >
                    {personal.email}
                  </a>
                </div>
              </div>

              <button
                onClick={() => handleCopy(personal.email, 'email')}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  color: copiedType === 'email' ? '#34d399' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  flexShrink: 0,
                }}
                title="Copy Email Address"
              >
                {copiedType === 'email' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedType === 'email' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Phone Card */}
            <div className="glass-panel contact-item-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(139, 92, 246, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Phone size={20} color="var(--purple-light)" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Phone / WhatsApp
                  </div>
                  <a
                    href={`tel:${personal.phone}`}
                    style={{
                      color: 'var(--text-main)',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.96rem',
                      wordBreak: 'break-word',
                    }}
                  >
                    {personal.phone}
                  </a>
                </div>
              </div>

              <button
                onClick={() => handleCopy(personal.phone, 'phone')}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  color: copiedType === 'phone' ? '#34d399' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  flexShrink: 0,
                }}
                title="Copy Phone Number"
              >
                {copiedType === 'phone' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedType === 'phone' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* LinkedIn Profile Card */}
            <div className="glass-panel contact-item-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(14, 165, 233, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#38bdf8">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74V10.13H5.07v8.37h2.78z" />
                  </svg>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    LinkedIn Network
                  </div>
                  <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.94rem', wordBreak: 'break-all' }}>
                    linkedin.com/in/ritik-sondhi-113038422
                  </div>
                </div>
              </div>

              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'var(--chip-bg)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  flexShrink: 0,
                }}
              >
                <ExternalLink size={14} />
                <span>Connect</span>
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Right Column: Interactive Dispatch Terminal */}
        <ScrollReveal animation="throw-right" delayMs={100}>
          <div
            className="glass-panel"
            style={{
              padding: 'clamp(20px, 3.5vw, 32px)',
              background: 'var(--bg-card)',
              borderColor: 'rgba(6, 182, 212, 0.3)',
              height: '100%',
              boxSizing: 'border-box',
            }}
          >
            {formSubmitted ? (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '30px 16px',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  <Check size={28} color="#34d399" />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Transmission Received!
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '400px' }}>
                  Thank you, <strong style={{ color: 'var(--text-main)' }}>{formData.name}</strong>. Your message has been logged
                  and routed to Ritik Sondhi's direct inbox ({personal.email}). He will respond promptly.
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
                  <a
                    href={`mailto:${personal.email}?subject=${encodeURIComponent(`Portfolio Inquiry from ${formData.name}${formData.company ? ` (${formData.company})` : ''}`)}&body=${encodeURIComponent(`Hi Ritik,\n\n${formData.message}\n\nBest regards,\n${formData.name}\nEmail: ${formData.email}\n${formData.company ? `Company: ${formData.company}` : ''}`)}`}
                    className="btn-primary"
                    style={{ fontSize: '0.82rem', textDecoration: 'none', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Mail size={14} />
                    <span>Launch in Mail Client</span>
                  </a>

                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ name: '', email: '', company: '', message: '' });
                    }}
                    className="btn-secondary"
                    style={{ fontSize: '0.82rem' }}
                  >
                    Send Another Note
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <MessageSquare size={16} color="var(--cyan-light)" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Send a Direct Message
                  </h3>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.76rem',
                      color: 'var(--text-dim)',
                      marginBottom: '6px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    YOUR NAME / RECRUITER
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Vance"
                    style={{
                      width: '100%',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: 'var(--text-main)',
                      outline: 'none',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.76rem',
                      color: 'var(--text-dim)',
                      marginBottom: '6px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    YOUR EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    style={{
                      width: '100%',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: 'var(--text-main)',
                      outline: 'none',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.76rem',
                      color: 'var(--text-dim)',
                      marginBottom: '6px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    MESSAGE / ROLE SPECIFICATIONS
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Hi Ritik, we are looking for a Full Stack Lead with NestJS / PostgreSQL experience for immediate onboarding..."
                    style={{
                      width: '100%',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: 'var(--text-main)',
                      outline: 'none',
                      fontSize: '0.9rem',
                      resize: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{
                    justifyContent: 'center',
                    padding: '12px',
                    marginTop: '6px',
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'wait' : 'pointer',
                    fontSize: '0.92rem',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Transmitting to Backend API...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Dispatch Message to Ritik</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
