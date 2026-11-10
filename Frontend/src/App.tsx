import { useState } from "react";
import "./App.css";
import { PortfolioProvider } from "./context/PortfolioContext";
import { BackgroundCanvas } from "./components/BackgroundCanvas";
import { Navbar } from "./components/Navbar";
import { AdminBar } from "./components/AdminBar";
import { Hero } from "./components/Hero";
import { AgenticAICopilot } from "./components/AgenticAICopilot";
import { ExperienceMatrix } from "./components/ExperienceMatrix";
import { ArchitectureVisualizer } from "./components/ArchitectureVisualizer";
import { SkillsBento } from "./components/SkillsBento";
import { FlyingStickerCompanion } from "./components/FlyingStickerCompanion";
import { EducationAndRelocation } from "./components/EducationAndRelocation";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { LoginModal } from "./components/modals/LoginModal";
import { EditPersonalModal } from "./components/modals/EditPersonalModal";
import { EditExperienceModal } from "./components/modals/EditExperienceModal";
import { ManageSkillsModal } from "./components/modals/ManageSkillsModal";
import { EditArchitectureModal } from "./components/modals/EditArchitectureModal";
import { EditEducationModal } from "./components/modals/EditEducationModal";
import { EditMobilityModal } from "./components/modals/EditMobilityModal";
import { EditLanguagesModal } from "./components/modals/EditLanguagesModal";
import type { Experience, ArchitectureNode } from "./data/portfolioData";
import { Bot } from "lucide-react";

function PortfolioInner() {
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [activeQuery, setActiveQuery] = useState<string | undefined>(undefined);

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEditPersonalModalOpen, setIsEditPersonalModalOpen] = useState(false);
  const [isEditExperienceModalOpen, setIsEditExperienceModalOpen] =
    useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null,
  );
  const [isManageSkillsModalOpen, setIsManageSkillsModalOpen] = useState(false);

  // New section modals
  const [isEditArchitectureModalOpen, setIsEditArchitectureModalOpen] =
    useState(false);
  const [editingArchitectureNode, setEditingArchitectureNode] =
    useState<ArchitectureNode | null>(null);
  const [isEditEducationModalOpen, setIsEditEducationModalOpen] =
    useState(false);
  const [isEditMobilityModalOpen, setIsEditMobilityModalOpen] = useState(false);
  const [isEditLanguagesModalOpen, setIsEditLanguagesModalOpen] =
    useState(false);

  const handleOpenCopilot = (query?: string) => {
    setActiveQuery(query);
    setCopilotOpen(true);
  };

  const handleCloseCopilot = () => {
    setCopilotOpen(false);
  };

  const handleEditExperience = (exp: Experience) => {
    setEditingExperience(exp);
    setIsEditExperienceModalOpen(true);
  };

  const handleAddExperience = () => {
    setEditingExperience(null);
    setIsEditExperienceModalOpen(true);
  };

  const handleEditArchitectureNode = (node: ArchitectureNode) => {
    setEditingArchitectureNode(node);
    setIsEditArchitectureModalOpen(true);
  };

  return (
    <div className="app-container" style={{ position: "relative" }}>
      {/* Interactive Background Particle Mesh */}
      <BackgroundCanvas />

      {/* Interactive Flying Sticker Cartoon Companion */}
      <FlyingStickerCompanion />

      {/* Floating Navigation Bar */}
      <Navbar
        onOpenCopilot={() => handleOpenCopilot()}
        copilotActive={copilotOpen}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Admin Control Bar (Active when logged in) */}
      <AdminBar />

      {/* Hero Section */}
      <main id="main-content">
        <Hero
          onOpenCopilotWithQuery={handleOpenCopilot}
          onEditPersonal={() => setIsEditPersonalModalOpen(true)}
        />

        {/* Career Trajectory & Experience Matrix */}
        <ExperienceMatrix
          onAskCopilot={handleOpenCopilot}
          onEditExperience={handleEditExperience}
          onAddExperience={handleAddExperience}
        />

        {/* Microservices & System Architecture Playground */}
        <ArchitectureVisualizer onEditNode={handleEditArchitectureNode} />

        {/* Technical Skills Bento Grid */}
        <SkillsBento onManageSkills={() => setIsManageSkillsModalOpen(true)} />

        {/* Education Credentials, Mobility & Languages */}
        <EducationAndRelocation
          onManageEducation={() => setIsEditEducationModalOpen(true)}
          onEditMobility={() => setIsEditMobilityModalOpen(true)}
          onManageLanguages={() => setIsEditLanguagesModalOpen(true)}
        />

        {/* Contact & Dispatch Desk */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Persistent Floating Copilot Trigger */}
      {!copilotOpen && (
        <button
          onClick={() => handleOpenCopilot()}
          className="floating-copilot-trigger"
          aria-label="Open Ritik's AI Copilot"
        >
          <Bot size={18} />
          <span>Ask Ritik AI</span>
          <span
            className="status-beacon"
            style={{ width: "6px", height: "6px" }}
          />
        </button>
      )}

      {/* Embedded Agentic AI Copilot Console */}
      <AgenticAICopilot
        isOpen={copilotOpen}
        onClose={handleCloseCopilot}
        initialQuery={activeQuery}
      />

      {/* Modals using react-hook-form */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <EditPersonalModal
        isOpen={isEditPersonalModalOpen}
        onClose={() => setIsEditPersonalModalOpen(false)}
      />

      <EditExperienceModal
        isOpen={isEditExperienceModalOpen}
        onClose={() => setIsEditExperienceModalOpen(false)}
        experience={editingExperience}
      />

      <ManageSkillsModal
        isOpen={isManageSkillsModalOpen}
        onClose={() => setIsManageSkillsModalOpen(false)}
      />

      <EditArchitectureModal
        isOpen={isEditArchitectureModalOpen}
        onClose={() => setIsEditArchitectureModalOpen(false)}
        node={editingArchitectureNode}
      />

      <EditEducationModal
        isOpen={isEditEducationModalOpen}
        onClose={() => setIsEditEducationModalOpen(false)}
      />

      <EditMobilityModal
        isOpen={isEditMobilityModalOpen}
        onClose={() => setIsEditMobilityModalOpen(false)}
      />

      <EditLanguagesModal
        isOpen={isEditLanguagesModalOpen}
        onClose={() => setIsEditLanguagesModalOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <PortfolioProvider>
      <PortfolioInner />
    </PortfolioProvider>
  );
}

export default App;
