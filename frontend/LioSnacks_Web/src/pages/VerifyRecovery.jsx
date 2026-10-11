import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function VerifyRecovery() {
  const { verifyRecoveryCode, requestRecoveryCode, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const inputs = useRef([]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  function handleDigitChange(value, index) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError("");
    if (digit && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < CODE_LENGTH) {
      setError("Ingresa el código de 6 dígitos completo.");
      return;
    }
    setError("");
    const result = await verifyRecoveryCode(code);
    if (!result.ok) {
      setError(result.message);
      setDigits(Array(CODE_LENGTH).fill(""));
      inputs.current[0]?.focus();
      return;
    }
    navigate("/recuperar/nueva-contrasena");
  }

  async function handleResend() {
    if (!email || cooldown > 0) return;
    setError("");
    setInfo("");
    const result = await requestRecoveryCode(email);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setDigits(Array(CODE_LENGTH).fill(""));
    inputs.current[0]?.focus();
    setCooldown(RESEND_COOLDOWN);
    setInfo("Código reenviado.");
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-14 sm:px-8">
      <div className="animate-rise rounded-2xl border border-nebula-border bg-void-soft/80 p-7 shadow-xl backdrop-blur-md sm:p-9">
        {/* Tag */}
        <div className="mb-6 flex items-center gap-2 text-teal">
          <ShieldCheck className="h-5 w-5" />
          <span className="font-body text-xs font-semibold uppercase tracking-widest">
            Verificar código
          </span>
        </div>

        <h1 className="font-display text-2xl font-semibold text-stardust">
          Revisa tu correo
        </h1>
        <p className="mt-2 font-body text-sm text-mist">
          Enviamos un código de 6 dígitos a{" "}
          <span className="text-stardust">{email || "tu correo"}</span>.
          Expira en 15 minutos.
        </p>

        <form onSubmit={handleVerify} className="mt-6 flex flex-col gap-4">
          {/* Inputs individuales */}
          <div className="flex justify-between gap-2">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                disabled={loading}
                className={`h-12 w-12 rounded-xl border text-center font-body text-lg font-bold text-stardust outline-none transition-all duration-200 focus:scale-105 ${
                  digit
                    ? "border-teal bg-teal/10"
                    : "border-nebula-border bg-nebula"
                } disabled:opacity-60`}
              />
            ))}
          </div>

          {error && <p className="font-body text-sm text-coral">{error}</p>}
          {info && !error && <p className="font-body text-sm text-teal">{info}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-teal py-3 font-body text-sm font-semibold text-teal-ink transition-colors hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Verificar código"}
          </button>

          {/* Reenviar */}
          <div className="flex items-center justify-center gap-1 font-body text-xs text-mist">
            <span>¿No llegó el código?</span>
            {cooldown > 0 ? (
              <span className="text-mist-dim">Reenviar en {cooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-bloom underline decoration-dotted hover:text-bloom-dark disabled:opacity-50"
              >
                Reenviar
              </button>
            )}
          </div>
        </form>

        <p className="mt-4 text-center font-body text-xs text-mist-dim">
          <Link to="/recuperar" className="underline decoration-dotted hover:text-mist">
            ← Cambiar correo
          </Link>
        </p>
      </div>
    </section>
  );
}
