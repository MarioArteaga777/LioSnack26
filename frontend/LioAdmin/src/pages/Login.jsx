// Login.jsx contiene la pantalla de inicio de sesión.
// La lógica de autenticación (mock/API real) vive en AuthContext;
// aquí solo se consume a través de useAuth().
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const justResetPassword = location.state?.passwordReset;

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

          {justResetPassword && (
            <div
              className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
              role="status"
              aria-live="polite"
            >
              🔐 Contraseña actualizada. Inicia sesión con tu nueva contraseña.
            </div>
          )}

          <form
            className="mt-8 space-y-6"
            onSubmit={handleSubmit(attemptLogin)}
            noValidate
          >
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Correo electrónico
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
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:bg-white"
                  required
                  {...passwordRegister}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-500 transition-colors hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
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
            <p
              className="text-center text-sm hover:text-blue-400 text-[#201D73] cursor-pointer"
              onClick={() => navigate("/verify-account")}
            >
              Si necesita verificar su cuenta, puede dar click a este mensaje
              para redirigirlo.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
