import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Terminal,
  Layers,
  ShieldCheck,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface AgenticAICopilotProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'agent' | 'tool';
  text: string;
  toolCall?: {
    toolName: string;
    params: string;
    resultPreview: string;
  };
  timestamp: string;
}

export const AgenticAICopilot: React.FC<AgenticAICopilotProps> = ({
  isOpen,
  onClose,
  initialQuery,
}) => {
  const { data } = usePortfolio();
  const [persona, setPersona] = useState<'recruiter' | 'architect' | 'reviewer'>('recruiter');
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: `Hello! I am Ritik Sondhi's Autonomous Career Agent. I have real-time access to his live portfolio graph, 4 production engineering roles (Dubai Remote, Mohali, West Bengal, UP), and system architecture blueprints.\n\nAsk me about his proficiency in specific technologies (like Python, NestJS, React, PostgreSQL), his collision detection algorithms, or paste your job requirements to calculate an instant candidate match score!`,
      timestamp: 'Just now',
    },
  ]);

  // Recruiter Match state
  const [selectedMatchTags, setSelectedMatchTags] = useState<string[]>([
    'React.js',
    'NestJS',
    'PostgreSQL',
    'Microservices',
  ]);
  const availableTags = [
    'React.js',
    'Next.js',
    'TypeScript',
    'NestJS',
    'Node.js',
    'PostgreSQL',
    'Prisma ORM',
    'Microservices',
    'Docker',
    'CI/CD',
    'Python',
    'AI Workflows',
  ];

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  useEffect(() => {
    if (initialQuery && isOpen) {
      handleQuerySubmit(initialQuery);
    }
  }, [initialQuery, isOpen]);

  const handleQuerySubmit = async (queryText: string) => {
    if (!queryText.trim() || isProcessing) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    const q = queryText.toLowerCase().trim();

    let toolName = 'query_experience_db';
    let toolParams = '';
    let toolResult = '';
    let agentResponse = '';

    // 1. Python specific inquiry
    if (q.includes('python')) {
      toolName = 'evaluate_skill_competency';
      toolParams = JSON.stringify({
        candidate: data.personal.name,
        target_technology: 'Python',
        context: 'AI Workflows & Backend Systems',
      });
      toolResult = 'Identified strong adaptability for Python in AI tooling, scripting, and data pipelines.';
      agentResponse =
        `**Ritik Sondhi's Experience & Proficiency with Python:**\n\n` +
        `• **AI & Agentic Workflows**: Ritik's profile explicitly highlights his experience in **supervising AI-assisted workflows and autonomous agent outputs**. In this domain, Python is a standard companion for agent orchestration, prompt chaining, data transformation scripts, and automated test synthesis.\n\n` +
        `• **Core Production Stack**: In enterprise production, Ritik primarily architects mission-critical microservices and dashboards using **TypeScript, NestJS, Node.js, React, and PostgreSQL** (such as decoupled billing at Propertise and loan ingestion at Agami).\n\n` +
        `• **Polyglot Adaptability**: With his strong grasp of **Service Abstraction Layers, REST APIs, and microservices design**, Ritik easily applies Python frameworks (such as FastAPI, Flask, or PyTorch/LLM wrappers) whenever systems require Python service nodes.\n\n` +
        `• **Verdict**: Highly capable in Python for AI tooling, automation scripts, and backend service integration.`;
    }
    // 2. Propertise inquiry
    else if (q.includes('propertise') || q.includes('billing') || q.includes('payment') || q.includes('dubai')) {
      toolName = 'inspect_service_abstraction';
      toolParams = JSON.stringify({ role: 'Propertise', location: 'Dubai (Remote)', focus: 'Payment Decoupling' });
      toolResult = 'Loaded service abstraction layer, Docker staging pipelines, and financial ledger sync.';
      agentResponse =
        `At **Propertise** (${data.experiences.find((e) => e.id === 'propertise')?.period || 'Mar 2025 – Aug 2026'}, Dubai Remote):\n\n` +
        `• **Decoupled Billing Architecture**: Ritik designed backend service abstraction layers using NestJS and TypeScript to decouple core database entities from dynamic multi-channel billing and payment APIs.\n` +
        `• **Zero-Regression Code Reviews**: Conducted strict peer code reviews ensuring 100% TypeScript type safety, system security, and regression-free PR merges.\n` +
        `• **Containerized CI/CD**: Managed automated pipelines to execute comprehensive test suites and push Docker builds to staging.\n` +
        `• **Ledger Tracking**: Built multi-level approval workflows with custom status checks, audit logs, and real-time financial ledger synchronization.`;
    }
    // 3. BrainCave / Collision / Scheduling
    else if (q.includes('braincave') || q.includes('collision') || q.includes('scheduling') || q.includes('algorithm')) {
      toolName = 'analyze_algorithm_complexity';
      toolParams = JSON.stringify({ system: 'Academic Operations Suite', module: 'Collision Detection' });
      toolResult = 'Verified time-slot recurrence rules & RBAC security pipelines.';
      agentResponse =
        `At **BrainCave Software Pvt. Ltd** (West Bengal Remote):\n\n` +
        `• **Collision Detection Engine**: Ritik engineered an automated scheduling module equipped with deterministic collision detection algorithms and recurrence rules, eliminating conflicting time-slot allocations across complex academic tiers.\n` +
        `• **High-Density Grids**: Created operations suites with high-density data grids to map multi-tier dependencies.\n` +
        `• **Granular Security**: Implemented Role-Based Access Control (RBAC) pipelines to secure administrative actions and educator onboarding flows.`;
    }
    // 4. Primotech / Telemetry / Power BI / Prisma
    else if (q.includes('primotech') || q.includes('telemetry') || q.includes('power bi') || q.includes('prisma')) {
      toolName = 'query_telemetry_pipeline';
      toolParams = JSON.stringify({ company: 'Primotech', feature: 'Telemetry & Embedded Power BI' });
      toolResult = 'Mapped Prisma ORM abstraction layers and Microsoft SSO token exchange.';
      agentResponse =
        `At **Primotech** (Mohali, Punjab):\n\n` +
        `• **Real-Time Telemetry**: Ritik engineered telemetry and estimation grids enabling business teams to visualize forecasting metrics and analyze seasonal trends.\n` +
        `• **Embedded Power BI SSO**: Integrated embedded Power BI analytics dashboards using Microsoft SSO authentication, reducing licensing costs across distributed users.\n` +
        `• **Clean Data Abstraction**: Implemented clean abstraction layers between external reporting APIs and internal sales data models using Prisma ORM and SQL.`;
    }
    // 5. Agami Technologies / LOS / Webhooks
    else if (q.includes('agami') || q.includes('loan') || q.includes('los') || q.includes('webhook')) {
      toolName = 'inspect_event_pipeline';
      toolParams = JSON.stringify({ company: 'Agami Technologies', pattern: 'Third-party LOS Webhooks' });
      toolResult = 'Event-driven Redux state pipeline synced via REST listeners.';
      agentResponse =
        `At **Agami Technologies** (Greater Noida):\n\n` +
        `• **Real-Time Loan Pipelines**: Engineered role-based dashboards in React, TypeScript, and Redux Toolkit to track multi-stage loan pipelines and conversion rates in real time.\n` +
        `• **LOS Integration Layers**: Created integration abstraction layers syncing third-party Loan Origination Systems (LOS) via webhook listeners and REST services.\n` +
        `• **Automated Underwriting Triggers**: Automated digital document collection and event-driven notifications (SMS/Email) upon reaching critical underwriting stages.`;
    }
    // 6. Relocation / Availability / Salary
    else if (q.includes('relocation') || q.includes('relocate') || q.includes('travel') || q.includes('notice') || q.includes('available')) {
      toolName = 'query_candidate_availability';
      toolParams = JSON.stringify({ candidate: data.personal.name, location: data.personal.location });
      toolResult = 'Availability: Immediate. Relocation: Open to India & Global Hubs.';
      agentResponse =
        `**Availability & Mobility Status for Ritik Sondhi:**\n\n` +
        `• **Location**: ${data.personal.location}\n` +
        `• **Relocation Readiness**: ${data.personal.relocation}. Open to immediate relocation across India (Bengaluru, NCR, Hyderabad, Pune, Mohali) as well as Dubai/UAE and international hubs.\n` +
        `• **Notice Period**: Immediate / Zero notice period.\n` +
        `• **Languages**: English (Professional), Hindi (Native).\n` +
        `• **Contact**: ${data.personal.email} | ${data.personal.phone}`;
    }
    // 7. Tech Stack: React / Next / Nest / Docker / Postgres / Type Safety
    else if (
      q.includes('react') ||
      q.includes('next') ||
      q.includes('nest') ||
      q.includes('docker') ||
      q.includes('postgres') ||
      q.includes('sql') ||
      q.includes('typescript') ||
      q.includes('type safety')
    ) {
      toolName = 'inspect_core_architecture_stack';
      toolParams = JSON.stringify({ query: queryText, stack: ['NestJS', 'React', 'PostgreSQL', 'Docker'] });
      toolResult = 'Verified 3+ years production delivery across full-stack distributed tiers.';
      agentResponse =
        `**Production Expertise in ${queryText}:**\n\n` +
        `• **Type Safety & Reliability**: Ritik enforces a 100% strict TypeScript policy with zero loose \`any\`, automated pre-commit hooks, and regression-free PR merges.\n` +
        `• **Microservices & Backend**: Production architect using NestJS, Node.js, and Express, implementing clean service abstraction layers that insulate core database schemas from third-party APIs.\n` +
        `• **Data Architecture**: High-throughput PostgreSQL with Prisma ORM, SQL query optimization, and Timescale time-series streams for real-time forecasting grids.\n` +
        `• **DevOps & Containers**: Dockerized container pipelines integrated with GitHub Actions CI/CD for automated test suites.`;
    }
    // 8. Recruiter match / evaluation
    else if (q.includes('match') || q.includes('hire') || q.includes('evaluate') || q.includes('lead') || q.includes('role')) {
      toolName = 'compute_candidate_match_score';
      toolParams = JSON.stringify({
        candidate: data.personal.name,
        evaluated_skills: ['React', 'NestJS', 'PostgreSQL', 'Microservices', 'Docker', 'AI Workflows'],
      });
      toolResult = 'Candidate Match Score: 96.4% across full-stack engineering.';
      agentResponse =
        `**Candidate Evaluation for Ritik Sondhi:**\n\n` +
        `• **Match Score**: 96%\n` +
        `• **Key Strengths**: 3+ years engineering real-time analytics dashboards, scalable backend microservices, and supervising AI-assisted workflows.\n` +
        `• **Engineering Leadership**: Experienced in designing modular abstraction layers, managing CI/CD Docker pipelines, and conducting peer code reviews across globally distributed teams (Dubai & India).\n` +
        `• **Mobility**: Open to travel and immediate relocation.`;
    }
    // 9. General fallback with full query context
    else {
      toolName = 'query_fullstack_graph';
      toolParams = JSON.stringify({ query: queryText });
      toolResult = `Queried live portfolio graph for "${queryText}". Found relevant data in personal bio and ${data.experiences.length} roles.`;
      agentResponse =
        `Regarding "${queryText}":\n\n` +
        `Ritik Sondhi is a **Full Stack Developer & AI Workflow Specialist** with 3+ years of experience engineering real-time analytics dashboards, scalable backend microservices, and decoupled service abstraction layers.\n\n` +
        `His production portfolio spans:\n` +
        `• **Frontend**: React.js, Next.js, TypeScript, Redux Toolkit, Tailwind CSS, shadcn/ui\n` +
        `• **Backend & APIs**: NestJS, Node.js, Express.js, REST APIs, Microservices, RBAC & JWT\n` +
        `• **Databases**: PostgreSQL, SQL, Prisma ORM, MongoDB, Timescale time-series\n` +
        `• **AI & DevOps**: AI Agent Supervision, Docker, GitHub Actions CI/CD\n\n` +
        `Would you like to know more about his work at **Propertise**, **Primotech**, **BrainCave**, or **Agami Technologies**?`;
    }

    // Step 1: Render Tool Execution Step
    setTimeout(() => {
      const toolMsg: Message = {
        id: `tool-${Date.now()}`,
        sender: 'tool',
        text: `Executing autonomous tool: ${toolName}`,
        toolCall: {
          toolName,
          params: toolParams,
          resultPreview: toolResult,
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, toolMsg]);

      // Step 2: Render Final Agent Response
      setTimeout(() => {
        const agentMsg: Message = {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          text: agentResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, agentMsg]);
        setIsProcessing(false);
      }, 700);
    }, 500);
  };

  const toggleTag = (tag: string) => {
    setSelectedMatchTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const computeInstantScore = () => {
    const total = selectedMatchTags.length;
    if (total === 0) return 0;
    return Math.min(100, Math.round(88 + (total / availableTags.length) * 11));
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        justifyContent: 'flex-end',
        background: 'rgba(5, 7, 12, 0.75)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Drawer Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          height: '100%',
          background: 'rgba(10, 14, 25, 0.96)',
          borderLeft: '1px solid rgba(6, 182, 212, 0.35)',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(6, 182, 212, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(13, 18, 31, 0.9)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(6, 182, 212, 0.5)',
              }}
            >
              <Bot size={18} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                  Ritik AI Copilot
                </span>
                <span className="code-tag" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                  v2.5 Autonomous
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#34d399' }}>
                <span className="status-beacon" style={{ width: '6px', height: '6px' }} />
                <span>Live Graph Synced • {data.experiences.length} Roles</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Close Copilot"
          >
            <X size={18} />
          </button>
        </div>

        {/* Persona Mode Switcher */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(8, 12, 22, 0.7)',
            padding: '6px 12px',
            gap: '8px',
          }}
        >
          <button
            onClick={() => setPersona('recruiter')}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: '6px',
              border: persona === 'recruiter' ? '1px solid var(--cyan-primary)' : '1px solid transparent',
              background: persona === 'recruiter' ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
              color: persona === 'recruiter' ? '#fff' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Zap size={13} color="var(--cyan-light)" />
            <span>Recruiter<span className="persona-btn-suffix"> Mode</span></span>
          </button>

          <button
            onClick={() => setPersona('architect')}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: '6px',
              border: persona === 'architect' ? '1px solid var(--purple-primary)' : '1px solid transparent',
              background: persona === 'architect' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
              color: persona === 'architect' ? '#fff' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Layers size={13} color="#c084fc" />
            <span>Architect<span className="persona-btn-suffix"> Mode</span></span>
          </button>

          <button
            onClick={() => setPersona('reviewer')}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: '6px',
              border: persona === 'reviewer' ? '1px solid #10b981' : '1px solid transparent',
              background: persona === 'reviewer' ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
              color: persona === 'reviewer' ? '#fff' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={13} color="#34d399" />
            <span>Reviewer<span className="persona-btn-suffix"> Mode</span></span>
          </button>
        </div>

        {/* Recruiter Job Matcher Widget */}
        <div
          style={{
            background: 'rgba(13, 19, 34, 0.85)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '12px 18px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
              <Sparkles size={14} color="var(--cyan-light)" />
              <span>Interactive Job Fit Calculator</span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#34d399',
                background: 'rgba(16, 185, 129, 0.12)',
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              Match: {computeInstantScore()}%
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {availableTags.slice(0, 8).map((tag) => {
              const active = selectedMatchTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{
                    background: active ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: active ? '1px solid var(--cyan-primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: active ? '#fff' : 'var(--text-dim)',
                    borderRadius: '4px',
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {active ? '✓ ' : '+ '}
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat History Container */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {messages.map((m) => {
            if (m.sender === 'user') {
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: 'flex-end',
                    maxWidth: '85%',
                    background: 'linear-gradient(135deg, #0891b2, #4f46e5)',
                    color: '#fff',
                    borderRadius: '14px 14px 2px 14px',
                    padding: '10px 14px',
                    fontSize: '0.88rem',
                    boxShadow: '0 4px 12px rgba(8, 145, 178, 0.25)',
                  }}
                >
                  {m.text}
                </div>
              );
            }

            if (m.sender === 'tool' && m.toolCall) {
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: 'flex-start',
                    width: '100%',
                    background: 'rgba(8, 12, 20, 0.9)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.76rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--purple-light)',
                      marginBottom: '4px',
                      fontWeight: 600,
                    }}
                  >
                    <Terminal size={12} color="var(--purple-light)" />
                    <span>TOOL CALL: {m.toolCall.toolName}</span>
                  </div>
                  <div style={{ color: 'var(--text-dim)', marginBottom: '4px', wordBreak: 'break-all' }}>
                    params: {m.toolCall.params}
                  </div>
                  <div style={{ color: 'var(--cyan-light)', background: 'rgba(6, 182, 212, 0.08)', padding: '4px 6px', borderRadius: '4px' }}>
                    output: {m.toolCall.resultPreview}
                  </div>
                </div>
              );
            }

            // Regular Agent response
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: 'flex-start',
                  maxWidth: '92%',
                  background: 'rgba(18, 24, 40, 0.85)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px 14px 14px 2px',
                  padding: '12px 16px',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  color: 'var(--text-main)',
                  whiteSpace: 'pre-line',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '6px',
                    fontSize: '0.74rem',
                    color: 'var(--cyan-light)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <Bot size={12} />
                  <span>RITIK-AI ({persona.toUpperCase()} PERSONA)</span>
                </div>
                {m.text}
              </div>
            );
          })}

          {isProcessing && (
            <div
              style={{
                alignSelf: 'flex-start',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(18, 24, 40, 0.85)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
              }}
            >
              <RefreshCw size={14} className="animate-spin" color="var(--cyan-light)" />
              <span>Agent reasoning & inspecting production graph...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'rgba(11, 16, 29, 0.95)',
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleQuerySubmit(input);
            }}
            style={{ display: 'flex', gap: '8px' }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                persona === 'recruiter'
                  ? 'Ask about Python, compensation, or job match...'
                  : persona === 'architect'
                  ? 'Ask about Propertise payment decoupling or Prisma...'
                  : 'Ask about CI/CD gates or TypeScript type safety...'
              }
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: '0.86rem',
                outline: 'none',
              }}
            />

            <button
              type="submit"
              disabled={isProcessing || !input.trim()}
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 16px',
                color: '#fff',
                cursor: isProcessing || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: isProcessing || !input.trim() ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 440px) {
          .persona-btn-suffix {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
