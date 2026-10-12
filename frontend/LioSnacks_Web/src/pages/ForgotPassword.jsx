import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword() {
  const { requestRecoveryCode, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Ingresa tu correo electrónico.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Ingresa un correo válido.");
      return;
    }

    const result = await requestRecoveryCode(trimmed);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate("/recuperar/verificar", { state: { email: trimmed } });
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-14 sm:px-8">
      <div className="animate-rise rounded-2xl border border-nebula-border bg-void-soft/80 p-7 shadow-xl backdrop-blur-md sm:p-9">
        {/* Tag */}
        <div className="mb-6 flex items-center gap-2 text-gold">
          <KeyRound className="h-5 w-5" />
          <span className="font-body text-xs font-semibold uppercase tracking-widest">
            Recuperar contraseña
          </span>
        </div>

        <h1 className="font-display text-2xl font-semibold text-stardust">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="mt-2 font-body text-sm text-mist">
          Ingresa tu correo y te enviaremos un código de 6 dígitos para
          restablecer tu contraseña.
        </p>

        <form noValidate onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="block">
            <span className="mb-1 block font-body text-xs font-medium text-mist">
              Correo electrónico
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              disabled={loading}
              className="w-full rounded-lg border border-nebula-border bg-nebula px-3 py-2.5 font-body text-sm text-stardust outline-none transition-colors focus:border-gold placeholder:text-mist-dim disabled:opacity-60"
            />
          </label>

          {error && <p className="font-body text-sm text-coral">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-gold py-3 font-body text-sm font-semibold text-bloom-ink transition-colors hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Enviando código..." : "Enviar código"}
          </button>
        </form>

        <p className="mt-6 text-center font-body text-sm text-mist">
          ¿Recordaste tu contraseña?{" "}
          <Link to="/login" className="text-bloom hover:text-bloom-dark">
            Inicia sesión
          </Link>
        </p>
      </div>
    </section>
  );
}
