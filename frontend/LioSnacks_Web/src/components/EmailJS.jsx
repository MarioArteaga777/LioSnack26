import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const form = useRef();

  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSending(true);
    setStatus(null);

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        }
      );

      setStatus({
        type: "success",
        message: "Tu mensaje fue enviado correctamente.",
      });

      form.current.reset();
    } catch (error) {
      console.error("Error enviando correo:", error);

      setStatus({
        type: "error",
        message:
          "No se pudo enviar el mensaje. Inténtalo nuevamente.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <div className="rounded-2xl border border-nebula-border bg-nebula/60 p-6 backdrop-blur-sm">
        <h1 className="font-display text-3xl font-semibold text-stardust">
          Contáctanos
        </h1>

        <p className="mt-2 font-body text-sm text-mist">
          ¿Tienes alguna pregunta? Envíanos un mensaje.
        </p>

        <form
          ref={form}
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          {/* Nombre */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block font-body text-sm text-stardust"
            >
              Nombre
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Tu nombre"
              className="w-full rounded-xl border border-nebula-border bg-void-soft/70 px-4 py-3 font-body text-sm text-stardust outline-none placeholder:text-mist-dim transition focus:border-teal"
            />
          </div>

          {/* Correo */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block font-body text-sm text-stardust"
            >
              Correo electrónico
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="correo@ejemplo.com"
              className="w-full rounded-xl border border-nebula-border bg-void-soft/70 px-4 py-3 font-body text-sm text-stardust outline-none placeholder:text-mist-dim transition focus:border-teal"
            />
          </div>

          {/* Asunto */}
          <div>
            <label
              htmlFor="subject"
              className="mb-2 block font-body text-sm text-stardust"
            >
              Asunto
            </label>

            <input
              id="subject"
              name="subject"
              type="text"
              required
              placeholder="¿En qué podemos ayudarte?"
              className="w-full rounded-xl border border-nebula-border bg-void-soft/70 px-4 py-3 font-body text-sm text-stardust outline-none placeholder:text-mist-dim transition focus:border-teal"
            />
          </div>

          {/* Mensaje */}
          <div>
            <label
              htmlFor="message"
              className="mb-2 block font-body text-sm text-stardust"
            >
              Mensaje
            </label>

            <textarea
              id="message"
              name="message"
              required
              rows={6}
              placeholder="Escribe tu mensaje..."
              className="w-full resize-none rounded-xl border border-nebula-border bg-void-soft/70 px-4 py-3 font-body text-sm text-stardust outline-none placeholder:text-mist-dim transition focus:border-teal"
            />
          </div>

          {/* Resultado */}
          {status && (
            <div
              className={`rounded-xl border px-4 py-3 font-body text-sm ${
                status.type === "success"
                  ? "border-teal/40 bg-teal/10 text-teal"
                  : "border-coral/40 bg-coral/10 text-coral"
              }`}
            >
              {status.message}
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-full bg-bloom px-6 py-3 font-body text-sm font-semibold text-bloom-ink transition-colors hover:bg-bloom-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? "Enviando..." : "Enviar mensaje"}
          </button>
        </form>
      </div>
    </section>
  );
}