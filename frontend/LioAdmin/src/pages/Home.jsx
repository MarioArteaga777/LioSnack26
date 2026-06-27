// Home.jsx muestra la pantalla principal del usuario una vez que ya está autenticado.
// También se asegura de que la página no esté disponible si no existe token.
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import SideBar from '../components/SideBar'

const Home = () => {
  const navigate = useNavigate() // Hook de react-router para redirigir programáticamente.
  const token = localStorage.getItem('fakestore_token') || sessionStorage.getItem('fakestore_token')
  // El usuario puede haber elegido guardar la sesión en localStorage o sessionStorage.
  const user = localStorage.getItem('fakestore_user') || sessionStorage.getItem('fakestore_user') || ''

  useEffect(() => {
    // Si no hay token, redirige al login.
    if (!token) {
      navigate('/')
    }
  }, [navigate, token])

  const handleLogout = () => {
    // Borra todos los datos de sesión del almacenamiento local y de sesión.
    localStorage.removeItem('fakestore_token')
    localStorage.removeItem('fakestore_user')
    localStorage.removeItem('fakestore_email')
    sessionStorage.removeItem('fakestore_token')
    sessionStorage.removeItem('fakestore_user')
    sessionStorage.removeItem('fakestore_email')
    navigate('/') // Redirige al login después de cerrar sesión.
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#110226]">
      {token && <SideBar />} {/* Muestra la navegación solo si hay token. */}
    </div>
  )
}

export default Home
