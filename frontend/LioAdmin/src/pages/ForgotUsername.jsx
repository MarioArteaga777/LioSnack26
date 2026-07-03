// Página para recuperar el nombre de usuario a partir del email registrado
import { useState } from "react";
import { useNavigate } from "react-router";
import img_Background from "../../img/background_image_2026.png";
import img_Logo from "../../img/Logo.png";

const ForgotUsername = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Por favor ingresa tu email.");
      return;
    }

    setLoading(true);

    try {
      // Aquí simularemos el envío de email de recuperación
      // En producción, esto sería una llamada a tu API
      setMessage(
        "Se ha enviado un enlace de recuperación a tu email. Por favor revisa tu bandeja de entrada."
      );
      setEmail("");
      
      // Opcional: redirige al login después de 3 segundos
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error_) {
      setError(error_.message || "Error al procesar tu solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8 flex items-center justify-center img"
      style={{
        backgroundImage: `url(${img_Background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-4xl bg-white p-6 shadow-xl shadow-slate-200/50 md:p-10 md:flex-row md:items-center">
        <div className="w-full">
          <div className="flex items-center justify-center">
            <img src={img_Logo} alt="Logo" className="size-50 mx-auto" />
          </div>
          <div className="flex items-center justify-center">
            <p className="text-1xl font-bold text-slate-900 sm:text-2xl mb-6">
              Recuperar Nombre de Usuario
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <p className="text-sm text-slate-600 mb-3">
                Ingresa el email asociado a tu cuenta. Te enviaremos un enlace para recuperar tu contraseña.
              </p>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="usuario@dominio.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:bg-white"
                required
              />
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

            {message && (
              <div
                className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                role="alert"
                aria-live="polite"
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              onClick={()=> navigate("/verification-code")}
              disabled={loading}
              className="flex w-full items-center justify-center rounded-2xl bg-[#201D73] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#6AA5D9] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Procesando..." : "Enviar Enlace de Recuperación"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex w-full justify-center text-sm font-semibold text-[#201D73] hover:text-gray-400"
            >
              Volver al Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotUsername;
