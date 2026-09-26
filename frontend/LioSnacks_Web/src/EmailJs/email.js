await emailjs.sendForm(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  form.current,
  {
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  }
);