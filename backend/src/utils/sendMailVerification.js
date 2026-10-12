const HTMLVerificationEmail = (code) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #202020;">
    <h1 style="margin: 0 0 16px;">Verifica tu correo</h1>
    <p>Ingresa este código en LioSnacks para completar la creación de tu cuenta:</p>
    <p style="margin: 24px 0; font-size: 32px; font-weight: bold; letter-spacing: 8px;">${code}</p>
    <p>El código vence en 15 minutos. Si no solicitaste crear una cuenta, puedes ignorar este correo.</p>
  </div>
`;

export default HTMLVerificationEmail;