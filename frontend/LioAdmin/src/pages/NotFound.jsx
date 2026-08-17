import { useNavigate } from "react-router-dom";

// Página 404 - Ruta no encontrada para LioAdmin
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center max-w-md">
        {/* Número 404 prominente */}
        <h1 className="text-9xl font-bold text-purple-400 mb-4">404</h1>

        {/* Mensaje principal */}
        <h2 className="text-4xl font-bold text-white mb-4">
          Página no encontrada
        </h2>

        {/* Descripción */}
        <p className="text-lg text-gray-300 mb-8">
          La página que buscas no existe o no tienes permiso para acceder.
          Regresa al panel de administración.
        </p>

        {/* Botones de navegación */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/home")}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
          >
            Ir al Dashboard
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full border border-purple-400 hover:border-purple-300 text-purple-300 hover:text-purple-200 font-semibold py-3 px-8 rounded-lg transition duration-300"
          >
            Volver Atrás
          </button>
        </div>
      </div>
    </div>
  );
}
