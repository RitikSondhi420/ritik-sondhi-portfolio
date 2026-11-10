import React from "react";
import { useForm } from "react-hook-form";
import { usePortfolio } from "../../context/PortfolioContext";
import { X, Plus, Trash2, Languages } from "lucide-react";

interface EditLanguagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LanguageFormInputs {
  name: string;
  proficiency: string;
}

export const EditLanguagesModal: React.FC<EditLanguagesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { data, addLanguage, deleteLanguage } = usePortfolio();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LanguageFormInputs>({
    defaultValues: {
      name: "",
      proficiency: "Professional",
    },
  });

  if (!isOpen) return null;

  const onSubmit = (formData: LanguageFormInputs) => {
    addLanguage({
      name: formData.name.trim(),
      proficiency: formData.proficiency.trim(),
    });
    reset({
      name: "",
      proficiency: "Professional",
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(5, 8, 15, 0.85)",
        backdropFilter: "blur(12px)",
        padding: "20px",
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "520px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "clamp(20px, 4vw, 32px)",
          background: "rgba(11, 16, 29, 0.98)",
          borderColor: "rgba(6, 182, 212, 0.4)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
          }}
        >
          <X size={20} />
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(6, 182, 212, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Languages size={22} color="var(--cyan-light)" />
          </div>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff" }}>
              Manage Spoken Languages
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Add and manage your languages with <code>useForm</code>.
            </p>
          </div>
        </div>

        {/* Add Language Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "12px",
            padding: "18px",
            marginBottom: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.76rem",
                  color: "var(--text-dim)",
                  marginBottom: "6px",
                  fontFamily: "var(--font-mono)",
                }}
              >
                LANGUAGE
              </label>
              <input
                {...register("name", { required: "Language name is required" })}
                placeholder="e.g. German, French, Punjabi..."
                style={{
                  width: "100%",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: errors.name
                    ? "1px solid #f43f5e"
                    : "1px solid var(--border-subtle)",
                  borderRadius: "8px",
                  padding: "9px 12px",
                  color: "#fff",
                  outline: "none",
                  fontSize: "0.85rem",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.76rem",
                  color: "var(--text-dim)",
                  marginBottom: "6px",
                  fontFamily: "var(--font-mono)",
                }}
              >
                PROFICIENCY
              </label>
              <select
                {...register("proficiency", { required: true })}
                style={{
                  width: "100%",
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "8px",
                  padding: "9px 12px",
                  color: "#fff",
                  outline: "none",
                  fontSize: "0.85rem",
                }}
              >
                <option value="Native">Native</option>
                <option value="Professional">Professional</option>
                <option value="Fluent">Fluent</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Basic">Basic</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{
              padding: "9px 16px",
              fontSize: "0.85rem",
              alignSelf: "flex-start",
              marginTop: "4px",
            }}
          >
            <Plus size={15} />
            <span>Add Language</span>
          </button>
        </form>

        {/* Existing Languages List */}
        <div>
          <h4
            style={{
              fontSize: "0.82rem",
              color: "var(--text-dim)",
              textTransform: "uppercase",
              marginBottom: "12px",
              fontFamily: "var(--font-mono)",
            }}
          >
            Current Languages:
          </h4>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {data.personal.languages.map((lang) => (
              <div
                key={lang.name}
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.85rem",
                }}
              >
                <span style={{ color: "#fff", fontWeight: 600 }}>
                  {lang.name}
                </span>
                <span
                  style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}
                >
                  ({lang.proficiency})
                </span>
                <button
                  type="button"
                  onClick={() => deleteLanguage(lang.name)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fb7185",
                    cursor: "pointer",
                    padding: "2px",
                    display: "flex",
                  }}
                  title={`Delete ${lang.name}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
