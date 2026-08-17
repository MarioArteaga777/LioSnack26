import { useState } from "react";
import { useNavigate } from "react-router";
import url from "../utils/apiUrl";
import img_Background from "../../img/background_image_2026.png";
import img_Logo from "../../img/Logo.png";

const VerifyAccount = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);  
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim() || !code.trim()) {
      setError("Ingresa tu correo y el código de verificación.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${url}/register/verifyCodeEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: code.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No se pudo verificar la cuenta.");
      }

      setMessage(data.message || "Cuenta verificada con éxito.");
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (error_) {
      setError(error_.message || "Error al verificar la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Ingresa tu correo para reenviar el código.");
      return;
    }

    setResending(true);
    
    try {
      const response = await fetch(`${url}/register/resendCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No se pudo reenviar el código.");
      }

      setMessage(
        data.message || "Si el correo existe, se envió un nuevo código.",
      );
    } catch (error_) {
      setError(error_.message || "Error al reenviar el código.");
    } finally {
      setResending(false);
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
              Verificación de cuenta
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="usuario@dominio.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:bg-white"
                required
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Código de verificación
              </label>
              <p className="text-sm text-slate-600 mb-3">
                Ingresa el código de 6 dígitos que enviamos a tu correo. Si no
                lo encuentras, revisa la carpeta de spam.
              </p>
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="123456"
                maxLength={6}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:bg-white"
                required
              />
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="flex w-full justify-end text-sm font-semibold text-[#201D73] hover:text-gray-400 disabled:cursor-not-allowed disabled:text-slate-400"
              >
                {resending ? "Reenviando..." : "Reenviar código"}
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
              disabled={loading}
              className="flex w-full items-center justify-center rounded-2xl bg-[#201D73] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#6AA5D9] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <p>{loading ? "Verificando..." : "Verificar cuenta"}</p>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
