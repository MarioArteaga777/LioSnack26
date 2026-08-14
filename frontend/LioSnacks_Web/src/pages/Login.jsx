import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Rocket } from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const justVerified = location.state?.justVerified;
  const redirectTo = location.state?.from || "/";

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }

    const result = await login(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate(redirectTo, { replace: true });
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-14 sm:px-8">
      <div className="animate-rise rounded-2xl border border-nebula-border bg-void-soft/80 p-7 shadow-xl backdrop-blur-md sm:p-9">
        <div className="mb-6 flex items-center gap-2 text-bloom">
          <Rocket className="h-5 w-5" />
          <span className="font-body text-xs font-semibold uppercase tracking-widest">
            Iniciar sesión
          </span>
        </div>

        <h1 className="font-display text-2xl font-semibold text-stardust">
          Bienvenido de vuelta
        </h1>
        <p className="mt-2 font-body text-sm text-mist">
          Inicia sesión para continuar con tu compra.
        </p>

        {justVerified && (
          <p className="mt-3 rounded-lg border border-teal/30 bg-teal/10 px-3 py-2 font-body text-xs text-teal">
            Cuenta verificada. Ahora puedes iniciar sesión.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="block">
            <span className="mb-1 block font-body text-xs font-medium text-mist">Correo</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-nebula-border bg-nebula px-3 py-2.5 font-body text-sm text-stardust outline-none transition-colors focus:border-bloom"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-body text-xs font-medium text-mist">Contraseña</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-nebula-border bg-nebula px-3 py-2.5 font-body text-sm text-stardust outline-none transition-colors focus:border-bloom"
            />
          </label>

          {error && <p className="font-body text-sm text-coral">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-bloom py-3 font-body text-sm font-semibold text-bloom-ink transition-colors hover:bg-bloom-dark disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-6 text-center font-body text-sm text-mist">
          ¿Aún no tienes cuenta?{" "}
          <Link to="/registro" className="text-bloom hover:text-bloom-dark">
            Regístrate
          </Link>
        </p>
      </div>
    </section>
  );
}
