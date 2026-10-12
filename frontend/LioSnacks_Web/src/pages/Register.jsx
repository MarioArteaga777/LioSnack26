import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Rocket, ShieldCheck } from "lucide-react";

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
  "#ff8f6e", // coral
  "#f5a350", // naranja
  "#d9b26a", // gold
  "#63d9c4", // teal
  "#f5a8ca", // bloom
];

export default function Register() {
  const { register, verifyCode, resendCode, loading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("form"); // "form" | "verify"
  const [form, setForm] = useState({ name: "", lastName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const strengthLevel = getStrength(form.password);
  const strengthColor = STRENGTH_COLORS[strengthLevel];
  const strengthLabel = STRENGTH_LABELS[strengthLevel];

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!form.name || !form.lastName || !form.email || !form.password) {
      setError("Completa todos los campos para continuar.");
      return;
    }

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const result = await register(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    setInfo(result.message);
    setStep("verify");
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!code) {
      setError("Ingresa el código que enviamos a tu correo.");
      return;
    }

    const result = await verifyCode({ email: form.email, code });
    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate("/login", { state: { justVerified: true } });
  }

  async function handleResend() {
    setError("");
    const result = await resendCode(form.email);
    setInfo(result.message);
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-14 sm:px-8">
      <div className="animate-rise rounded-2xl border border-nebula-border bg-void-soft/80 p-7 shadow-xl backdrop-blur-md sm:p-9">
        <div className="mb-6 flex items-center gap-2 text-bloom">
          {step === "form" ? <Rocket className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
          <span className="font-body text-xs font-semibold uppercase tracking-widest">
            {step === "form" ? "Crear cuenta" : "Verifica tu correo"}
          </span>
        </div>

        {step === "form" ? (
          <>
            <h1 className="font-display text-2xl font-semibold text-stardust">
              Únete a la tripulación
            </h1>
            <p className="mt-2 font-body text-sm text-mist">
              Crea tu cuenta para guardar tus pedidos y avanzar más rápido en el checkout.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nombre" name="name" value={form.name} onChange={handleChange} />
                <Field label="Apellido" name="lastName" value={form.lastName} onChange={handleChange} />
              </div>
              <Field label="Correo" name="email" type="email" value={form.email} onChange={handleChange} />

              {/* Contraseña con toggle y barra de fortaleza */}
              <div className="flex flex-col gap-1">
                <span className="font-body text-xs font-medium text-mist">Contraseña</span>
                <div className="flex items-center overflow-hidden rounded-lg border border-nebula-border bg-nebula transition-colors focus-within:border-bloom">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    className="flex-1 bg-transparent px-3 py-2.5 font-body text-sm text-stardust outline-none placeholder:text-mist-dim"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="px-3 text-mist-dim transition-colors hover:text-stardust"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Barra de fortaleza */}
                {form.password.length > 0 && (
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
                      className="self-end font-body text-xs font-semibold transition-colors"
                      style={{ color: strengthColor }}
                    >
                      {strengthLabel}
                    </span>
                  </div>
                )}
              </div>

              {error && <p className="font-body text-sm text-coral">{error}</p>}
              {info && !error && <p className="font-body text-sm text-teal">{info}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-full bg-bloom py-3 font-body text-sm font-semibold text-bloom-ink transition-colors hover:bg-bloom-dark disabled:opacity-50"
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-semibold text-stardust">
              Revisa tu correo
            </h1>
            <p className="mt-2 font-body text-sm text-mist">
              Enviamos un código de 6 dígitos a{" "}
              <span className="text-stardust">{form.email}</span>. Expira en 15 minutos.
            </p>

            <form onSubmit={handleVerify} className="mt-6 flex flex-col gap-4">
              <Field
                label="Código de verificación"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
              />

              {error && <p className="font-body text-sm text-coral">{error}</p>}
              {info && !error && <p className="font-body text-sm text-teal">{info}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-full bg-bloom py-3 font-body text-sm font-semibold text-bloom-ink transition-colors hover:bg-bloom-dark disabled:opacity-50"
              >
                {loading ? "Verificando..." : "Verificar cuenta"}
              </button>

              <button
                type="button"
                onClick={handleResend}
                className="font-body text-xs text-mist underline decoration-dotted hover:text-stardust"
              >
                Reenviar código
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setCode("");
                  setError("");
                  setInfo("");
                }}
                className="font-body text-xs text-mist underline decoration-dotted hover:text-stardust"
              >
                Modificar mis datos
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center font-body text-sm text-mist">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-bloom hover:text-bloom-dark">
            Inicia sesión
          </Link>
        </p>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", value, onChange, maxLength }) {
  return (
    <label className="block">
      <span className="mb-1 block font-body text-xs font-medium text-mist">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className="w-full rounded-lg border border-nebula-border bg-nebula px-3 py-2.5 font-body text-sm text-stardust outline-none transition-colors focus:border-bloom"
      />
    </label>
  );
}
