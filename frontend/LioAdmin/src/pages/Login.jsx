// Login.jsx contiene la pantalla de inicio de sesión.
// Para este ejemplo se usa un usuario fijo en memoria y se crea un token falso.
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import MultiLevelSidebar from "../components/SideBar";
import img_Background from "../../img/background_image_2026.png";
import img_Logo from "../../img/Logo.png";

// Lista de usuarios válidos usados solo para la demo del login.
// Esta lista no viene de ninguna API; es solo un conjunto de credenciales locales.
const users = [
  {
    id: 1,
    email: "john@gmail.com",
    username: "johnd",
    password: "12345",
  },
  {
    id: 2,
    email: "morrison@gmail.com",
    username: "mor_2314",
    password: "83445",
  },
  {
    id: 3,
    email: "kevin@gmail.com",
    username: "kevinryan",
    password: "kev02937@",
  },
];

const login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emailRegister = register("email");
  const passwordRegister = register("password");

  const attemptLogin = async (data) => {
    setLoading(true);
    setError("");

    try {
      const user = users.find(
        (u) =>
          u.email === data.email &&
          u.password === data.password
      );

      if (!user) {
        throw new Error("Correo o contraseña incorrectos");
      }

      // Token falso
      const fakeToken = crypto.randomUUID();

      localStorage.setItem("token", fakeToken);

      localStorage.setItem(
        "token",
        JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.email,
          password: user.password
        })
      );

      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Si ya existe un token, el usuario ya está autenticado.
    // Entonces redirige directamente a la página de inicio.
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

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
          {/** 
          <div className="max-w-screen jusityn-center text-center">
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Bienvenido</h1>
          </div>
          */}

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

            {/**
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Guardar sesión
              </label> 
                <button
                  type="button"
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  ¿Olvidaste tu contraseña?
                </button>

            </div>
            */}

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

export default login;
