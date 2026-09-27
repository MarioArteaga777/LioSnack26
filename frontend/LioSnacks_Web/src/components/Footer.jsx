import { Moon, Globe } from "lucide-react";

// Icono SVG de Instagram
function InstagramIcon(props) {
  return (
    <svg
      {...props}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

// Icono SVG de Facebook
function FacebookIcon(props) {
  return (
    <svg
      {...props}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

// Icono SVG de WhatsApp
function WhatsappIcon(props) {
  return (
    <svg
      {...props}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.762.459 3.48 1.332 5.001L2 22l5.127-1.339a9.92 9.92 0 0 0 4.885 1.28h.005c5.507 0 9.99-4.479 9.99-9.985 0-2.667-1.038-5.175-2.926-7.062A9.915 9.915 0 0 0 12.012 2Zm0 18.318h-.004a8.27 8.27 0 0 1-4.218-1.156l-.303-.18-3.132.818.835-3.048-.198-.314a8.28 8.28 0 0 1-1.272-4.437c0-4.566 3.715-8.282 8.285-8.282 2.213 0 4.293.862 5.858 2.428a8.232 8.232 0 0 1 2.424 5.856c0 4.567-3.716 8.283-8.283 8.283Zm4.537-6.208c-.248-.124-1.472-.726-1.7-.809-.228-.083-.393-.124-.559.124-.165.248-.642.809-.787.974-.145.166-.29.186-.538.062-.248-.124-1.05-.387-2.001-1.234-.74-.66-1.24-1.475-1.385-1.723-.145-.248-.015-.382.108-.505.112-.112.248-.29.373-.435.124-.145.165-.248.248-.414.083-.166.042-.311-.02-.435-.063-.124-.559-1.348-.766-1.848-.202-.487-.407-.421-.559-.429h-.477c-.166 0-.435.062-.663.311-.228.248-.871.85-.871 2.073 0 1.223.891 2.404 1.015 2.57.124.166 1.753 2.677 4.248 3.754.593.256 1.056.409 1.417.524.595.189 1.136.162 1.564.098.477-.072 1.472-.601 1.679-1.18.207-.579.207-1.076.145-1.18-.062-.104-.228-.186-.476-.31Z" />
    </svg>
  );
}

export default function Footer() {
  const socialLinks = {
    instagram: "https://www.instagram.com/lio_snacks/",
    facebook: "https://www.facebook.com/profile.php?id=61583089574182",
    whatsapp: "https://api.whatsapp.com/message/VXUKJKQB5ESHC1?autoload=1&app_absent=0"
  };

  return (
    <footer className="border-t border-nebula-border bg-void-soft/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <div className="flex items-center gap-2 font-display text-base font-semibold text-stardust">
            LioSnack
          </div>
          <p className="mt-1 font-body text-xs text-mist-dim">
            © 2026 LioSnack Fruta liofilizada al nivel de la nasa. Todos los derechos reservados.
          </p>
        </div>

        {/* Navegación a las páginas del proyecto */}
        <nav className="flex flex-wrap gap-x-6 gap-y-2 font-body text-xs text-mist">
          <a href="/privacidad" className="transition-colors hover:text-stardust">
            Privacidad
          </a>
          <a href="/terminos" className="transition-colors hover:text-stardust">
            Términos y Condiciones
          </a>
          <a href="/soporte" className="transition-colors hover:text-stardust">
            Soporte
          </a>
        </nav>

        {/* Redes Sociales Interactivas */}
        <div className="flex items-center gap-4">
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-mist-dim transition-colors hover:text-stardust"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>

          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-mist-dim transition-colors hover:text-stardust"
          >
            <FacebookIcon className="h-5 w-5" />
          </a>

          <a
            href={socialLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="text-mist-dim transition-colors hover:text-stardust"
          >
            <WhatsappIcon className="h-5 w-5" />
          </a>

          <Globe className="ml-2 h-5 w-5 text-mist-dim" strokeWidth={1.5} />
        </div>
      </div>
    </footer>
  );
}