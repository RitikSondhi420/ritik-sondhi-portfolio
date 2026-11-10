import React, { useEffect, useState, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Flame, Leaf, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface CompanionWaypoint {
  name: string;
  sectionId: string;
  targetX: number; // percentage of viewport width
  targetY: number; // percentage of viewport height
  demonSpeech: string;
  peacefulSpeech: string;
}

export const FlyingStickerCompanion: React.FC = () => {
  const { theme } = usePortfolio();
  const isLight = theme === 'light';

  const [speechText, setSpeechText] = useState(
    isLight
      ? "Greetings! I'm Aura, your peaceful guide. Let's explore Ritik's craft with calm clarity! 🌿✨"
      : "Heh! I'm Ignis, your demon guide! Scroll to summon secrets! 😈🔥"
  );
  const [showSpeech, setShowSpeech] = useState(true);
  const [isWinking, setIsWinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [bubblePlacement, setBubblePlacement] = useState<'left' | 'right' | 'below'>('left');

  const companionRef = useRef<HTMLDivElement | null>(null);
  const speechRef = useRef<HTMLDivElement | null>(null);

  // Position physics refs (avoiding React state re-renders for buttery 120fps motion)
  const currentPos = useRef({ x: 84, y: 38, rot: 0, scaleX: 1 });
  const targetPos = useRef({ x: 84, y: 38, rot: 0, scaleX: 1 });
  const lastScrollY = useRef(0);
  const activeSectionRef = useRef('overview');
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const waypoints: CompanionWaypoint[] = [
    {
      name: 'overview',
      sectionId: 'overview',
      targetX: 86,
      targetY: 38,
      demonSpeech: "Greetings, mortal! I am Ignis, your demon guide through Ritik's realm! 😈🔥",
      peacefulSpeech: "Greetings! I'm Aura, your peaceful guide. Let's explore Ritik's craft with calm clarity! 🌿✨",
    },
    {
      name: 'experience',
      sectionId: 'experience',
      targetX: 14,
      targetY: 34,
      demonSpeech: 'Gliding by CAREER TRAJECTORY! 3+ years of dark arts & scalable code! ⚡',
      peacefulSpeech: 'Career Trajectory: 3+ years cultivating resilient architectures & thoughtful code. 🌸',
    },
    {
      name: 'architecture',
      sectionId: 'architecture',
      targetX: 86,
      targetY: 32,
      demonSpeech: 'Resting on LIVE SYSTEM TOPOLOGY! High resilience & zero downtime! 🖤',
      peacefulSpeech: 'System Topology: Designed with harmony, graceful failovers, and zen simplicity. 🕊️',
    },
    {
      name: 'skills',
      sectionId: 'skills',
      targetX: 86,
      targetY: 36,
      demonSpeech: 'Behold the Technical Arsenal: TypeScript, NestJS & PostgreSQL mastered! 💫',
      peacefulSpeech: 'Technical Garden: Deep roots in TypeScript, NestJS, and modern full-stack craftsmanship. 🌱',
    },
    {
      name: 'education',
      sectionId: 'education',
      targetX: 86,
      targetY: 34,
      demonSpeech: 'Mobility Passport verified: Ready to summon worldwide collaboration! ✈️',
      peacefulSpeech: 'Continuous Growth & Mobility: Open to mindful collaboration across the globe! ✈️',
    },
    {
      name: 'contact',
      sectionId: 'contact',
      targetX: 86,
      targetY: 32,
      demonSpeech: 'Waiting by Message Dispatcher: Ready to send your thoughts to Ritik! 💌',
      peacefulSpeech: 'Message Dispatcher: Reach out anytime. Your thoughts are always warmly welcome! 💌',
    },
  ];

  // Random playful winks & blinks
  useEffect(() => {
    const winkTimer = setInterval(() => {
      setIsWinking(true);
      setTimeout(() => setIsWinking(false), 380);
    }, 4200);
    return () => clearInterval(winkTimer);
  }, []);

  // Update speech bubble placement dynamically based on position to avoid edges
  const updateSpeechPlacement = useCallback((xPct: number, yPct: number) => {
    if (xPct > 50) {
      setBubblePlacement('left');
    } else {
      setBubblePlacement('right');
    }

    if (yPct < 26) {
      setBubblePlacement(xPct > 50 ? 'left' : 'right');
    }
  }, []);

  // Sync speech persona whenever theme changes (Aura vs Ignis)
  useEffect(() => {
    const currentWaypoint =
      waypoints.find((wp) => wp.name === activeSectionRef.current) || waypoints[0];
    setSpeechText(isLight ? currentWaypoint.peacefulSpeech : currentWaypoint.demonSpeech);
  }, [isLight]);

  // Throttled scroll listener to calculate waypoints without lagging the browser
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY.current;
      const speed = Math.abs(delta);

      if (speed > 2) {
        if (delta > 0) {
          targetPos.current.rot = Math.min(speed * 0.6, 16);
          targetPos.current.scaleX = 1;
        } else {
          targetPos.current.rot = Math.max(-speed * 0.6, -14);
          targetPos.current.scaleX = -1;
        }

        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          targetPos.current.rot = 0;
          targetPos.current.scaleX = 1;
        }, 150);
      }

      lastScrollY.current = scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          let matched = waypoints[0];
          for (const wp of waypoints) {
            const el = document.getElementById(wp.sectionId);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= window.innerHeight * 0.65 && rect.bottom >= window.innerHeight * 0.2) {
                matched = wp;
                break;
              }
            }
          }

          if (matched.name !== activeSectionRef.current) {
            activeSectionRef.current = matched.name;
            targetPos.current.x = matched.targetX;
            targetPos.current.y = matched.targetY;
            setSpeechText(isLight ? matched.peacefulSpeech : matched.demonSpeech);
            setShowSpeech(true);
            updateSpeechPlacement(matched.targetX, matched.targetY);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [isLight, updateSpeechPlacement, waypoints]);

  // Spring physics animation loop: gentle float + organic gliding
  useEffect(() => {
    let animId: number;
    let time = 0;

    const loop = () => {
      time += 0.035;

      // Gentle floating bobbing
      const bobY = Math.sin(time) * 4;
      const bobX = Math.cos(time * 0.75) * 2;

      // Interpolation lerp towards target
      const lerp = 0.07;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerp;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerp;
      currentPos.current.rot += (targetPos.current.rot - currentPos.current.rot) * 0.12;
      currentPos.current.scaleX += (targetPos.current.scaleX - currentPos.current.scaleX) * 0.15;

      if (companionRef.current) {
        const posX = currentPos.current.x + (bobX / window.innerWidth) * 100;
        const posY = currentPos.current.y + (bobY / window.innerHeight) * 100;

        companionRef.current.style.left = `${posX}%`;
        companionRef.current.style.top = `${posY}%`;
        companionRef.current.style.transform = `translate(-50%, -50%) rotate(${currentPos.current.rot}deg) scaleX(${currentPos.current.scaleX})`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Quotes for avatar clicks
  const demonQuotes = [
    "Heh! Pact sealed: Zero compile errors and zero regressions! 😈✨",
    "Decoupled microservices... absolute demonic efficiency! ⚡",
    "I devoured all the memory leaks for breakfast! 🖤",
    "Ritik's code is so clean, even the netherworld respects it! 📜",
    "Clicking me summons extra dev powers! Scroll down, mortal! 🔥",
    "Have questions? Ask our AI Copilot anytime! 🤖",
  ];

  const peacefulQuotes = [
    "Take a deep breath. Every bug is just a step towards clarity. 🌿",
    "Writing clean code is like tending a peaceful zen garden. 🌱✨",
    "Mindful design, elegant architecture, zero stress. 🕊️",
    "Peace of mind and bug-free production for all! 🧘",
    "Simplicity is the soul of great software craftsmanship. 💫",
    "Have questions? Our AI Copilot is here to assist peacefully! 🤖",
  ];

  // Interactive Click on Avatar: loop spin + theme-matched confetti + personality quotes
  const handleClickAvatar = () => {
    if (companionRef.current) {
      companionRef.current.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
      companionRef.current.style.transform += ' scale(1.2) rotate(360deg)';
      setTimeout(() => {
        if (companionRef.current) {
          companionRef.current.style.transition = '';
        }
      }, 700);
    }

    try {
      confetti({
        particleCount: 32,
        spread: 60,
        origin: {
          x: currentPos.current.x / 100,
          y: currentPos.current.y / 100,
        },
        colors: isLight
          ? ['#0d9488', '#2dd4bf', '#a78bfa', '#fbcfe8', '#fef08a']
          : ['#f43f5e', '#fbbf24', '#c084fc', '#2dd4bf', '#1e1b2e'],
      });
    } catch {
      // Graceful fallback
    }

    const quotes = isLight ? peacefulQuotes : demonQuotes;
    setSpeechText(quotes[Math.floor(Math.random() * quotes.length)]);
    setShowSpeech(true);
  };

  return (
    <aside
      ref={companionRef}
      className="peaceful-companion-root lumi-companion-wrapper"
      style={{
        position: 'fixed',
        left: '84%',
        top: '38%',
        transform: 'translate(-50%, -50%)',
        zIndex: 90,
        pointerEvents: 'auto',
        cursor: 'pointer',
        userSelect: 'none',
        willChange: 'transform, left, top',
      }}
      onClick={handleClickAvatar}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={
        isLight
          ? 'Click Aura for mindful zen wisdom & sparkles!'
          : 'Click Ignis for playful demon embers & wisdom!'
      }
      aria-label={
        isLight ? 'Aura the peaceful companion avatar' : 'Ignis the demon companion avatar'
      }
    >
      {/* Speech Bubble */}
      {showSpeech && (
        <div
          ref={speechRef}
          className="lumi-speech-bubble"
          style={{
            position: 'absolute',
            ...(bubblePlacement === 'left'
              ? {
                  right: '100%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  marginRight: '16px',
                }
              : bubblePlacement === 'right'
              ? {
                  left: '100%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  marginLeft: '16px',
                }
              : {
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginTop: '16px',
                }),
            background: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(11, 16, 29, 0.94)',
            border: isLight
              ? '1.5px solid rgba(13, 148, 136, 0.4)'
              : '1.5px solid rgba(244, 63, 94, 0.6)',
            borderRadius: '16px',
            padding: '10px 14px',
            boxShadow: isLight
              ? '0 12px 32px rgba(13, 148, 136, 0.16), 0 2px 8px rgba(0, 0, 0, 0.05)'
              : '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 16px rgba(244, 63, 94, 0.25)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            minWidth: '190px',
            maxWidth: '240px',
            color: isLight ? '#182430' : '#ffffff',
            fontSize: '0.82rem',
            fontWeight: 500,
            lineHeight: '1.45',
            textAlign: 'left',
            pointerEvents: 'auto',
            animation: 'gentleBubbleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            setShowSpeech(false);
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '6px',
              marginBottom: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {isLight ? (
                <>
                  <Leaf size={13} color="#0d9488" />
                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: '#0d9488',
                      fontWeight: 700,
                      letterSpacing: '0.6px',
                    }}
                  >
                    AURA:
                  </span>
                </>
              ) : (
                <>
                  <Flame size={13} color="#f43f5e" />
                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: '#f43f5e',
                      fontWeight: 700,
                      letterSpacing: '0.6px',
                    }}
                  >
                    IGNIS:
                  </span>
                </>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSpeech(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: isLight ? '#4e6170' : 'var(--text-dim)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Close message"
            >
              <X size={12} />
            </button>
          </div>
          <div>{speechText}</div>
        </div>
      )}

      {/* Main Avatar Container */}
      <div
        className="lumi-avatar-container"
        style={{
          width: '84px',
          height: '84px',
          position: 'relative',
          filter: isLight
            ? isHovered
              ? 'drop-shadow(0 0 10px rgba(13, 148, 136, 0.45)) drop-shadow(0 12px 24px rgba(13, 148, 136, 0.2))'
              : 'drop-shadow(0 0 6px rgba(13, 148, 136, 0.25)) drop-shadow(0 8px 18px rgba(0, 0, 0, 0.08))'
            : isHovered
            ? 'drop-shadow(0 0 6px #f43f5e) drop-shadow(0 0 18px rgba(244, 63, 94, 0.7)) drop-shadow(0 12px 24px rgba(0, 0, 0, 0.6))'
            : 'drop-shadow(0 0 3px rgba(244, 63, 94, 0.5)) drop-shadow(0 0 12px rgba(192, 132, 252, 0.4)) drop-shadow(0 8px 18px rgba(0, 0, 0, 0.4))',
          transition: 'filter 0.3s ease',
        }}
      >
        {isLight ? (
          /* ======================================================== */
          /* LIGHT MODE: AURA - Serene Peaceful Zen Spirit Avatar      */
          /* ======================================================== */
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <defs>
              {/* Pearlescent Zen Spirit Body Gradient */}
              <linearGradient id="peacefulBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="65%" stopColor="#f0fdfa" />
                <stop offset="100%" stopColor="#ccfbf1" />
              </linearGradient>

              {/* Golden/Teal Zen Halo Gradient */}
              <linearGradient id="haloGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="50%" stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>

              {/* Feathery Angel/Cloud Wing Gradient */}
              <linearGradient id="peacefulWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#e0f2fe" />
                <stop offset="100%" stopColor="#99f6e4" />
              </linearGradient>

              {/* Zen Leaf Sprout Gradient */}
              <linearGradient id="sproutGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>

            {/* Soft Zen Mist Petals Trailing Below */}
            <g style={{ opacity: 0.85 }}>
              <circle
                cx="44"
                cy="88"
                r="2.2"
                fill="#2dd4bf"
                style={{ animation: 'sparkleBob 1.6s infinite alternate' }}
              />
              <circle
                cx="56"
                cy="92"
                r="1.8"
                fill="#a78bfa"
                style={{ animation: 'sparkleBob 1.9s infinite alternate 0.3s' }}
              />
              <circle
                cx="50"
                cy="95"
                r="1.5"
                fill="#fde047"
                style={{ animation: 'sparkleBob 1.4s infinite alternate 0.6s' }}
              />
            </g>

            {/* Golden Glowing Floating Halo */}
            <g style={{ animation: 'peacefulHaloFloat 2.6s ease-in-out infinite alternate' }}>
              <ellipse
                cx="50"
                cy="16"
                rx="20"
                ry="5.5"
                fill="none"
                stroke="url(#haloGrad)"
                strokeWidth="2.4"
                strokeDasharray="18 4"
                style={{ animation: 'peacefulHaloGlow 2s ease-in-out infinite alternate' }}
              />
            </g>

            {/* Left Feathery Cloud Wing */}
            <path
              d="M 28 46 C 14 34, 2 40, 2 52 C 8 54, 14 52, 16 56 C 20 58, 24 54, 28 60 Z"
              fill="url(#peacefulWingGrad)"
              stroke="rgba(13, 148, 136, 0.4)"
              strokeWidth="1.2"
              style={{
                animation: 'peacefulWingLeft 2.4s ease-in-out infinite alternate',
                transformOrigin: '28px 50px',
              }}
            />

            {/* Right Feathery Cloud Wing */}
            <path
              d="M 72 46 C 86 34, 98 40, 98 52 C 92 54, 86 52, 84 56 C 80 58, 76 54, 72 60 Z"
              fill="url(#peacefulWingGrad)"
              stroke="rgba(13, 148, 136, 0.4)"
              strokeWidth="1.2"
              style={{
                animation: 'peacefulWingRight 2.4s ease-in-out infinite alternate',
                transformOrigin: '72px 50px',
              }}
            />

            {/* Gentle Zen Sprout Blooming from Head */}
            <g style={{ animation: 'sproutSway 3s ease-in-out infinite alternate', transformOrigin: '50px 26px' }}>
              {/* Stem */}
              <path d="M 50 26 Q 50 18 50 14" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" />
              {/* Left Leaf */}
              <path d="M 50 16 C 42 12, 42 6, 50 11 Z" fill="url(#sproutGrad)" stroke="#059669" strokeWidth="0.8" />
              {/* Right Leaf */}
              <path d="M 50 14 C 58 10, 58 4, 50 9 Z" fill="url(#sproutGrad)" stroke="#059669" strokeWidth="0.8" />
            </g>

            {/* Pearlescent Chibi Cloud Body */}
            <path
              d="M 50 26 
                 C 66 26, 77 34, 77 48 
                 C 83 52, 85 64, 79 72 
                 C 73 80, 61 82, 50 82 
                 C 39 82, 27 80, 21 72 
                 C 15 64, 17 52, 23 48 
                 C 23 34, 34 26, 50 26 Z"
              fill="url(#peacefulBodyGrad)"
              stroke="rgba(13, 148, 136, 0.35)"
              strokeWidth="2.2"
            />

            {/* Soft Highlight Arc */}
            <path
              d="M 38 31 C 46 28, 54 28, 62 31"
              fill="none"
              stroke="rgba(255, 255, 255, 0.9)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Gentle Cloud Hands */}
            <ellipse cx="24" cy="56" rx="4.5" ry="4" fill="#ffffff" stroke="rgba(13, 148, 136, 0.3)" strokeWidth="1.2" />
            <ellipse cx="76" cy="56" rx="4.5" ry="4" fill="#ffffff" stroke="rgba(13, 148, 136, 0.3)" strokeWidth="1.2" />

            {/* Expressive Peaceful Eyes */}
            {isWinking ? (
              <g>
                {/* Left Eye: Gentle Happy Wink Arc */}
                <path d="M 36 50 Q 41 45 46 50" fill="none" stroke="#0f766e" strokeWidth="2.8" strokeLinecap="round" />
                {/* Right Eye: Big Sparkling Calm Eye */}
                <circle cx="58" cy="49" r="4.8" fill="#0f766e" />
                <circle cx="59.5" cy="47.5" r="1.6" fill="#ffffff" />
                <circle cx="57" cy="50.5" r="0.8" fill="#ffffff" />
              </g>
            ) : isHovered ? (
              /* Double Happy Eyes ^ ^ on Hover */
              <g>
                <path d="M 36 50 Q 41 44 46 50" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />
                <path d="M 54 50 Q 59 44 64 50" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" />
              </g>
            ) : (
              /* Luminous Serene Eyes */
              <g>
                <circle cx="41" cy="49" r="4.8" fill="#0f766e" />
                <circle cx="42.5" cy="47.5" r="1.6" fill="#ffffff" />
                <circle cx="40" cy="50.5" r="0.8" fill="#ffffff" />

                <circle cx="59" cy="49" r="4.8" fill="#0f766e" />
                <circle cx="60.5" cy="47.5" r="1.6" fill="#ffffff" />
                <circle cx="58" cy="50.5" r="0.8" fill="#ffffff" />
              </g>
            )}

            {/* Soft Peach Rosy Cheeks */}
            <circle cx="33" cy="55" r="4" fill="#f472b6" opacity="0.45" />
            <circle cx="67" cy="55" r="4" fill="#f472b6" opacity="0.45" />

            {/* Peaceful Serene Smile */}
            <path
              d="M 46 55 Q 50 59 54 55"
              fill="none"
              stroke="#0f766e"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Floating Sparkles when Hovered */}
            {isHovered && (
              <g style={{ animation: 'peacefulSparkleFloat 0.9s infinite ease-out' }}>
                <path
                  d="M 50 10 L 51.5 13 L 55 14.5 L 51.5 16 L 50 19 L 48.5 16 L 45 14.5 L 48.5 13 Z"
                  fill="#f59e0b"
                />
              </g>
            )}
          </svg>
        ) : (
          /* ======================================================== */
          /* DARK MODE: IGNIS - Fiery Chibi Demon Companion Avatar    */
          /* ======================================================== */
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <defs>
              {/* Chibi Demon Body Gradient */}
              <linearGradient id="demonBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2e2744" />
                <stop offset="60%" stopColor="#1e1b2e" />
                <stop offset="100%" stopColor="#141120" />
              </linearGradient>

              {/* Glowing Demon Horn Flame Gradient */}
              <linearGradient id="hornGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#be123c" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>

              {/* Demon Wing Gradient */}
              <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4338ca" />
                <stop offset="60%" stopColor="#2e2744" />
                <stop offset="100%" stopColor="#1e1b2e" />
              </linearGradient>

              {/* Tail Spade Gradient */}
              <linearGradient id="tailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
            </defs>

            {/* Floating Embers / Fire Motes Trailing Below */}
            <g style={{ opacity: 0.9 }}>
              <circle
                cx="44"
                cy="88"
                r="2.2"
                fill="#f43f5e"
                style={{ animation: 'sparkleBob 1.5s infinite alternate' }}
              />
              <circle
                cx="56"
                cy="92"
                r="1.8"
                fill="#fbbf24"
                style={{ animation: 'sparkleBob 1.8s infinite alternate 0.3s' }}
              />
              <circle
                cx="50"
                cy="96"
                r="1.4"
                fill="#c084fc"
                style={{ animation: 'sparkleBob 1.3s infinite alternate 0.6s' }}
              />
            </g>

            {/* Demon Devil Tail with Spade Arrow Tip */}
            <g
              className="demon-tail-group"
              style={{ animation: 'demonTailWag 2.6s ease-in-out infinite alternate' }}
            >
              <path
                d="M 52 74 C 70 82, 84 80, 86 64 C 87 56, 80 50, 86 44"
                fill="none"
                stroke="#1e1b2e"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Spade Arrowhead */}
              <polygon points="86,34 94,46 86,43 78,46" fill="url(#tailGrad)" />
            </g>

            {/* Left Demon Bat Wing */}
            <path
              d="M 28 46 C 14 36, 4 40, 2 50 C 8 52, 14 50, 16 54 C 20 56, 24 52, 28 58 Z"
              fill="url(#wingGrad)"
              stroke="#f43f5e"
              strokeWidth="1.2"
              style={{
                animation: 'demonWingLeft 2.2s ease-in-out infinite alternate',
                transformOrigin: '28px 50px',
              }}
            />

            {/* Right Demon Bat Wing */}
            <path
              d="M 72 46 C 86 36, 96 40, 98 50 C 92 52, 86 50, 84 54 C 80 56, 76 52, 72 58 Z"
              fill="url(#wingGrad)"
              stroke="#f43f5e"
              strokeWidth="1.2"
              style={{
                animation: 'demonWingRight 2.2s ease-in-out infinite alternate',
                transformOrigin: '72px 50px',
              }}
            />

            {/* Demon Horns (Left & Right Glowing Horns) */}
            <path
              d="M 36 32 C 28 20, 20 14, 22 6 C 30 11, 38 20, 42 27 Z"
              fill="url(#hornGrad)"
              stroke="#fff"
              strokeWidth="0.8"
            />
            <path
              d="M 64 32 C 72 20, 80 14, 78 6 C 70 11, 62 20, 58 27 Z"
              fill="url(#hornGrad)"
              stroke="#fff"
              strokeWidth="0.8"
            />

            {/* Floating Flame Wisp Crown */}
            <g style={{ animation: 'demonFlameFloat 2s ease-in-out infinite alternate' }}>
              <path
                d="M 50 8 C 47 13, 44 16, 47 20 C 50 22, 53 20, 53 16 C 53 12, 51 9, 50 8 Z"
                fill="url(#hornGrad)"
              />
            </g>

            {/* Chibi Demon Body */}
            <path
              d="M 50 26 
                 C 66 26, 77 34, 77 48 
                 C 83 52, 85 64, 79 72 
                 C 73 80, 61 82, 50 82 
                 C 39 82, 27 80, 21 72 
                 C 15 64, 17 52, 23 48 
                 C 23 34, 34 26, 50 26 Z"
              fill="url(#demonBodyGrad)"
              stroke="rgba(244, 63, 94, 0.45)"
              strokeWidth="2.5"
            />

            {/* Soft Highlight on Head */}
            <path
              d="M 38 31 C 46 28, 54 28, 62 31"
              fill="none"
              stroke="rgba(192, 132, 252, 0.5)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Little Demon Hands */}
            <ellipse
              cx="24"
              cy="56"
              rx="4.5"
              ry="4"
              fill="#2e2744"
              stroke="#f43f5e"
              strokeWidth="1.2"
            />
            <ellipse
              cx="76"
              cy="56"
              rx="4.5"
              ry="4"
              fill="#2e2744"
              stroke="#f43f5e"
              strokeWidth="1.2"
            />

            {/* Expressive Glowing Demon Eyes */}
            {isWinking ? (
              <g>
                {/* Left Eye: Winking stylish arc */}
                <path
                  d="M 36 50 Q 41 46 46 50"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                {/* Right Eye: Big Glowing Demon Eye */}
                <circle cx="58" cy="49" r="5" fill="#fbbf24" />
                <circle cx="58" cy="49" r="2.2" fill="#0f172a" />
                <circle cx="59.5" cy="47.5" r="1.2" fill="#ffffff" />
              </g>
            ) : isHovered ? (
              /* Starry Happy Eyes on Hover */
              <g fill="#fbbf24">
                <text x="34" y="55" fontSize="13" fontWeight="bold">
                  ★
                </text>
                <text x="54" y="55" fontSize="13" fontWeight="bold">
                  ★
                </text>
              </g>
            ) : (
              /* Luminous Curious Demon Eyes */
              <g>
                <circle cx="41" cy="49" r="5" fill="#fbbf24" />
                <circle cx="41" cy="49" r="2.2" fill="#0f172a" />
                <circle cx="42.5" cy="47.5" r="1.2" fill="#ffffff" />

                <circle cx="59" cy="49" r="5" fill="#fbbf24" />
                <circle cx="59" cy="49" r="2.2" fill="#0f172a" />
                <circle cx="60.5" cy="47.5" r="1.2" fill="#ffffff" />
              </g>
            )}

            {/* Subtle Rosy Demon Blush */}
            <circle cx="33" cy="55" r="3.5" fill="#f43f5e" opacity="0.6" />
            <circle cx="67" cy="55" r="3.5" fill="#f43f5e" opacity="0.6" />

            {/* Demon Smirk with Tiny Cute Fang */}
            <path
              d="M 46 56 Q 50 60 54 56"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Tiny Cute Little Fang */}
            <polygon points="51,57 53,57 52,60" fill="#ffffff" />

            {/* Floating Flame Ember when Hovered */}
            {isHovered && (
              <g style={{ animation: 'floatFlame 0.9s infinite ease-out' }}>
                <path
                  d="M 50 12 C 46 8, 42 10, 42 14 C 42 18, 50 22, 50 22 C 50 22, 58 18, 58 14 C 58 10, 54 8, 50 12 Z"
                  fill="#f43f5e"
                />
              </g>
            )}
          </svg>
        )}
      </div>

      <style>{`
        @keyframes gentleBubbleIn {
          0% {
            opacity: 0;
            transform: scale(0.85);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Peaceful Avatar Keyframes */
        @keyframes peacefulWingLeft {
          0% { transform: rotate(-4deg); }
          100% { transform: rotate(14deg); }
        }

        @keyframes peacefulWingRight {
          0% { transform: rotate(4deg); }
          100% { transform: rotate(-14deg); }
        }

        @keyframes sproutSway {
          0% { transform: rotate(-6deg); }
          100% { transform: rotate(6deg); }
        }

        @keyframes peacefulHaloFloat {
          0% { transform: translateY(0); }
          100% { transform: translateY(-3px); }
        }

        @keyframes peacefulHaloGlow {
          0% { opacity: 0.8; stroke-width: 2.2; }
          100% { opacity: 1; stroke-width: 2.8; }
        }

        @keyframes peacefulSparkleFloat {
          0% { transform: translateY(0) scale(0.8); opacity: 1; }
          100% { transform: translateY(-12px) scale(1.1); opacity: 0; }
        }

        /* Demon Avatar Keyframes */
        @keyframes demonWingLeft {
          0% { transform: rotate(-5deg); }
          100% { transform: rotate(18deg); }
        }

        @keyframes demonWingRight {
          0% { transform: rotate(5deg); }
          100% { transform: rotate(-18deg); }
        }

        @keyframes demonTailWag {
          0% { transform: rotate(-8deg); transform-origin: 52px 74px; }
          100% { transform: rotate(12deg); transform-origin: 52px 74px; }
        }

        @keyframes demonFlameFloat {
          0% { transform: translateY(0) scale(0.9); }
          100% { transform: translateY(-3px) scale(1.15); }
        }

        @keyframes sparkleBob {
          0% { transform: translateY(0); opacity: 0.4; }
          100% { transform: translateY(6px); opacity: 1; }
        }

        @keyframes floatFlame {
          0% { transform: translateY(0) scale(0.8); opacity: 1; }
          100% { transform: translateY(-12px) scale(1.1); opacity: 0; }
        }

        @media (max-width: 768px) {
          .lumi-avatar-container {
            width: 52px !important;
            height: 52px !important;
          }
          .lumi-speech-bubble {
            max-width: 200px !important;
            min-width: 150px !important;
            font-size: 0.75rem !important;
            padding: 8px 10px !important;
          }
        }

        @media (max-width: 480px) {
          .lumi-avatar-container {
            width: 42px !important;
            height: 42px !important;
          }
          .lumi-speech-bubble {
            display: none !important;
          }
        }
      `}</style>
    </aside>
  );
};
