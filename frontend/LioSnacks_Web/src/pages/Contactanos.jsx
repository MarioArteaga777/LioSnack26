import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

import {
  Mail,
  MessageCircle,
  AtSign,
  Clock,
  Send,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Correo",
    value: "liosnacksoporte@gmail.com",
    href: "mailto:liosnacksoporte@gmail.com",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+503 7483 0204",
    href: "https://api.whatsapp.com/message/VXUKJKQB5ESHC1?autoload=1&app_absent=0",
  },
  {
    icon: AtSign,
    label: "Instagram",
    value: "@lio_snack",
    href: "https://www.instagram.com/lio_snacks/",
  },
  {
    icon: Clock,
    label: "Horario de atención",
    value: "Lun. a Sáb. · 8:00 a.m. – 6:00 p.m.",
    href: null,
  },
];

export default function Contactanos() {
  const formRef = useRef(null);

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
  });

  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (
      !form.nombre.trim() ||
      !form.correo.trim() ||
      !form.mensaje.trim()
    ) {
      setError("Completa todos los campos para enviar tu mensaje.");
      return;
    }

    const correoValido = /\S+@\S+\.\S+/.test(form.correo);

    if (!correoValido) {
      setError("Ingresa un correo válido.");
      return;
    }

    try {
      setSending(true);

      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        }
      );

      setSent(true);
    } catch (err) {
      console.error("Error al enviar el correo:", err);

      setError(
        "No pudimos enviar tu mensaje. Inténtalo nuevamente."
      );
    } finally {
      setSending(false);
    }
  }

  function handleReset() {
    setForm({
      nombre: "",
      correo: "",
      mensaje: "",
    });

    setSent(false);
    setError("");
  }

  return (
    <section
      id="top"
      className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16"
    >
      <div className="animate-rise max-w-lg">
        <h1 className="font-display text-3xl font-semibold text-stardust sm:text-4xl">
          Contáctanos
        </h1>

        <p className="mt-3 font-body text-sm leading-relaxed text-mist">
          ¿Tienes dudas sobre un pedido, quieres ser distribuidor o simplemente
          saludar a la tripulación? Escríbenos y te respondemos pronto.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
        {/* Información de contacto */}
        <div className="flex flex-col gap-3">
          {contactInfo.map(
            ({ icon: Icon, label, value, href }) => {
              const content = (
                <div className="animate-rise flex items-start gap-3 rounded-xl border border-nebula-border bg-nebula/60 p-4 backdrop-blur-sm transition-colors hover:border-mist-dim">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-nebula-light text-teal">
                    <Icon
                      className="h-4 w-4"
                      strokeWidth={1.75}
                    />
                  </span>

                  <div>
                    <p className="font-body text-xs font-medium text-mist">
                      {label}
                    </p>

                    <p className="font-body text-sm text-stardust">
                      {value}
                    </p>
                  </div>
                </div>
              );

              return href ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {content}
                </a>
              ) : (
                <div key={label}>
                  {content}
                </div>
              );
            }
          )}
        </div>

        {/* Formulario */}
        <div className="animate-rise rounded-2xl border border-nebula-border bg-void-soft/80 p-7 shadow-xl backdrop-blur-md sm:p-9">
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <CheckCircle2
                className="h-10 w-10 text-teal"
                strokeWidth={1.5}
              />

              <h2 className="font-display text-xl font-semibold text-stardust">
                ¡Mensaje enviado!
              </h2>

              <p className="max-w-xs font-body text-sm text-mist">
                Gracias por escribirnos, {form.nombre}. Te responderemos a{" "}
                {form.correo} lo antes posible.
              </p>

              <button
                onClick={handleReset}
                className="mt-2 font-body text-xs text-mist underline decoration-dotted hover:text-stardust"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-display text-xl font-semibold text-stardust">
                Envíanos un mensaje
              </h2>

              <p className="mt-1 font-body text-sm text-mist">
                Completa el formulario y nos pondremos en contacto contigo.
              </p>

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="mt-6 flex flex-col gap-4"
              >
                <Field
                  label="Nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                />

                <Field
                  label="Correo"
                  name="correo"
                  type="email"
                  value={form.correo}
                  onChange={handleChange}
                />

                <label className="block">
                  <span className="mb-1 block font-body text-xs font-medium text-mist">
                    Mensaje
                  </span>

                  <textarea
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    rows={5}
                    className="w-full resize-none rounded-lg border border-nebula-border bg-nebula px-3 py-2.5 font-body text-sm text-stardust outline-none transition-colors focus:border-bloom"
                  />
                </label>

                {error && (
                  <p className="font-body text-sm text-coral">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-bloom py-3 font-body text-sm font-semibold text-bloom-ink transition-colors hover:bg-bloom-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      <LoaderCircle
                        className="h-4 w-4 animate-spin"
                        strokeWidth={2}
                      />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send
                        className="h-4 w-4"
                        strokeWidth={2}
                      />
                      Enviar mensaje
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-body text-xs font-medium text-mist">
        {label}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-nebula-border bg-nebula px-3 py-2.5 font-body text-sm text-stardust outline-none transition-colors focus:border-bloom"
      />
    </label>
  );
}