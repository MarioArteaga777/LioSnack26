// Login.jsx contiene la pantalla de inicio de sesión.
// La lógica de autenticación (mock/API real) vive en AuthContext;
// aquí solo se consume a través de useAuth().
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import img_Background from "../../img/background_image_2026.png";
import img_Logo from "../../img/Logo.png";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emailRegister = register("email");
  const passwordRegister = register("password");

  const attemptLogin = async (data) => {
    setLoading(true);
    setError("");

    const result = await login({ email: data.email, password: data.password });

    if (!result.ok) {
      setError(result.message);
    }

    setLoading(false);
    // La redirección ocurre en el efecto de abajo cuando isAuthenticated
    // pasa a true, para no navegar dos veces desde dos lugares distintos.
  };

  useEffect(() => {
    // Si ya hay una sesión activa, redirige directamente a inicio.
    if (!authLoading && isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  return (
    <div
      className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8 flex items-center justify-center img"
      style={{
        backgroundImage: `url(${img_Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 rounded-4xl bg-white p-6 shadow-xl shadow-slate-200/50 md:p-10 md:flex-row md:items-center">
        <div className="w-full">
          <div className="flex items-center justify-center">
            <img src={img_Logo} alt="Logo" className="size-50 mx-auto" />
          </div>
          <div className="flex items-center justify-center">
            <p className="text-1xl font-bold text-slate-900 sm:text-2xl mb-6">
              Pagina Administrativa de LioSnacks
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(attemptLogin)} noValidate>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                placeholder="usuario@dominio.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:bg-white"
                required
                {...emailRegister}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p
                  className="mt-1 text-xs text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.email.message || "El email es requerido."}
                </p>
              )}
              <button
                type="button"
                onClick={() => navigate("/forgot-username")}
                className="flex w-full justify-end text-sm font-semibold text-[#201D73] hover:text-gray-400"
              >
                ¿Olvidaste tu usuario?
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="********"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:bg-white"
                required
                {...passwordRegister}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p
                  className="mt-1 text-xs text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  {errors.password.message || "La contraseña es requerida."}
                </p>
              )}
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="flex w-full justify-end text-sm font-semibold text-[#201D73] hover:text-gray-400"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            {error && (
              <div
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-2xl bg-[#201D73] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#6AA5D9] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
