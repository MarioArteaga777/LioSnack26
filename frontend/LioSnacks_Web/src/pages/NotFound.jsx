import { useNavigate } from "react-router-dom";

// Página 404 - Ruta no encontrada
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        {/* Número 404 prominente */}
        <h1 className="text-9xl font-bold text-purple-500 mb-4">404</h1>

        {/* Mensaje principal */}
        <h2 className="text-4xl font-bold text-white mb-4">
          Página no encontrada
        </h2>

        {/* Descripción */}
        <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida. 
          Regresa al inicio para continuar comprando tus snacks favoritos.
        </p>

        {/* Botón para volver al inicio */}
        <button
          onClick={() => navigate("/")}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
        >
          Volver al Inicio
        </button>

        {/* Botón secundario para ir al catálogo */}
        <div className="mt-4">
          <button
            onClick={() => navigate("/catalogo")}
            className="text-purple-400 hover:text-purple-300 font-semibold underline transition duration-300"
          >
            Ir al Catálogo
          </button>
        </div>
      </div>
    </div>
  );
}
