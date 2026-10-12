import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useAuth } from "../context/AuthContext";

/** Calcula nivel de fortaleza de 0–5 */
function getStrength(pwd) {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

const STRENGTH_LABELS = ["", "Muy débil", "Débil", "Regular", "Buena", "Fuerte"];
const STRENGTH_COLORS = [
  "transparent",
  "#ff8f6e",
  "#f5a350",
  "#d9b26a",
  "#63d9c4",
  "#f5a8ca",
];

export default function NewPassword() {
  const { setNewPassword, loading } = useAuth();
  const navigate = useNavigate();

  const [newPassword, setNew] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const strengthLevel = getStrength(newPassword);
  const strengthColor = STRENGTH_COLORS[strengthLevel];
  const strengthLabel = STRENGTH_LABELS[strengthLevel];
  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Completa ambos campos.");
      return;
    }
    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const result = await setNewPassword({ newPassword, confirmNewPassword: confirmPassword });
    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate("/login", { state: { passwordReset: true } });
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-14 sm:px-8">
      <div className="animate-rise rounded-2xl border border-nebula-border bg-void-soft/80 p-7 shadow-xl backdrop-blur-md sm:p-9">
        {/* Tag */}
        <div className="mb-6 flex items-center gap-2 text-bloom">
          <LockKeyhole className="h-5 w-5" />
          <span className="font-body text-xs font-semibold uppercase tracking-widest">
            Nueva contraseña
          </span>
        </div>

        <h1 className="font-display text-2xl font-semibold text-stardust">
          Crea tu nueva contraseña
        </h1>
        <p className="mt-2 font-body text-sm text-mist">
          Elige una contraseña segura que no hayas usado antes.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {/* Nueva contraseña */}
          <div className="flex flex-col gap-1">
            <span className="font-body text-xs font-medium text-mist">Nueva contraseña</span>
            <div className="flex items-center overflow-hidden rounded-lg border border-nebula-border bg-nebula transition-colors focus-within:border-bloom">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNew(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
                className="flex-1 bg-transparent px-3 py-2.5 font-body text-sm text-stardust outline-none placeholder:text-mist-dim disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="px-3 text-mist-dim transition-colors hover:text-stardust"
                tabIndex={-1}
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Barra de fortaleza */}
            {newPassword.length > 0 && (
              <div className="mt-1.5 flex flex-col gap-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor:
                          level <= strengthLevel ? strengthColor : "var(--color-nebula-border)",
                      }}
                    />
                  ))}
                </div>
                <span
                  className="self-end font-body text-xs font-semibold"
                  style={{ color: strengthColor }}
                >
                  {strengthLabel}
                </span>
              </div>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div className="flex flex-col gap-1">
            <span className="font-body text-xs font-medium text-mist">Confirmar contraseña</span>
            <div className="flex items-center overflow-hidden rounded-lg border border-nebula-border bg-nebula transition-colors focus-within:border-bloom">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repite la contraseña"
                disabled={loading}
                className="flex-1 bg-transparent px-3 py-2.5 font-body text-sm text-stardust outline-none placeholder:text-mist-dim disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="px-3 text-mist-dim transition-colors hover:text-stardust"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Indicador de coincidencia */}
            {passwordsMatch && (
              <p className="font-body text-xs font-semibold text-teal">✓ Las contraseñas coinciden</p>
            )}
            {passwordsMismatch && (
              <p className="font-body text-xs font-semibold text-coral">✗ Las contraseñas no coinciden</p>
            )}
          </div>

          {error && <p className="font-body text-sm text-coral">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-bloom py-3 font-body text-sm font-semibold text-bloom-ink transition-colors hover:bg-bloom-dark disabled:opacity-50"
          >
            {loading ? "Actualizando..." : "Cambiar contraseña"}
          </button>
        </form>
      </div>
    </section>
  );
}
