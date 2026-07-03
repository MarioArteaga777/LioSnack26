import { Moon, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-nebula-border bg-void-soft/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <div className="flex items-center gap-2 font-display text-base font-semibold text-stardust">
            <Moon className="h-4 w-4 text-bloom" strokeWidth={1.75} />
            LioSnack
          </div>
          <p className="mt-1 font-body text-xs text-mist-dim">
            © 2026 LioSnack Cosmic Crunch. Todos los sistemas operativos.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 font-body text-xs text-mist">
          <a href="#" className="hover:text-stardust">Privacidad</a>
          <a href="#" className="hover:text-stardust">Términos Galácticos</a>
          <a href="#" className="hover:text-stardust">Soporte Tierra</a>
          <a href="#" className="hover:text-stardust">Prensa</a>
        </nav>

        <Globe className="h-5 w-5 text-mist-dim" strokeWidth={1.5} />
      </div>
    </footer>
  );
}
