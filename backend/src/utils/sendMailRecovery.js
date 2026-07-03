const HTMLRecoveryEmail = (code) => {
    return `
    <div style="font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif; text-align: center; background-color: #1a1a3a; padding: 40px 20px; color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 15px; border: 2px solid #3d3d7d; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
        
        <div style="margin-bottom: 35px; border-bottom: 2px solid #7d448c; padding-bottom: 15px; text-transform: uppercase;">
            <h1 style="color: #ffffff; font-size: 30px; margin: 0; line-height: 1.2;">
                <span style="font-weight: bold; color: #ffffff;">LIO ACTIVA</span><br>
                <span style="font-weight: bold; color: #ffffff;">PROTOCOLO:</span>
            </h1>
            <h1 style="color: #edacf7; font-size: 28px; font-weight: normal; margin: 0; margin-top: 5px; font-style: italic;">
                Recuperación de Señal
            </h1>
        </div>
        
        <p style="font-size: 17px; color: #ceddf3; line-height: 1.6; max-width: 450px; margin: 0 auto 30px auto; font-weight: normal;">
            <span style="display: block; font-size: 1.2em; font-weight: bold; color: #ffffff; text-align: left; margin-bottom: 10px;">¡Saludos, Explorador!</span>
            Recibimos una transmisión de datos para reconfigurar tu clave de acceso. Para completar el protocolo, utiliza el siguiente código de autorización galáctica:
        </p>
        
        <div style="display: inline-block; padding: 25px; margin: 0 0 35px 0; background-color: #ffffff; border: 4px solid #edacf7; border-radius: 12px; box-shadow: 0 0 20px rgba(237, 172, 247, 0.4); position: relative;">
            <span style="display: block; font-size: 12px; font-weight: bold; color: #edacf7; text-transform: uppercase; margin-bottom: 10px; font-style: italic;">DISPOSITIVO DE CLAVE LIO - CÓDIGO</span>
            <div style="font-size: 32px; font-weight: bold; color: #7d448c; letter-spacing: 5px; background: transparent; border: none; padding: 0; margin: 0; position: relative; z-index: 2;">
                ${code}
            </div>
            <div style="position: absolute; top: -10px; left: -10px; right: -10px; bottom: -10px; border-radius: 18px; filter: blur(15px); background: radial-gradient(circle, rgba(237, 172, 247, 0.2) 0%, rgba(237, 172, 247, 0.0) 70%); z-index: 1;"></div>
        </div>
        
        <p style="font-size: 15px; color: #ceddf3; line-height: 1.5; background-color: #3d3d7d; padding: 15px; border-radius: 8px; margin-bottom: 30px;">
            Este código de autorización se autodestruirá (quedará inválido) en <strong>15 minutos terrestres</strong>. Si tú no has iniciado este protocolo, puedes ignorar esta transmisión de forma segura.
        </p>
        
        <hr style="border: none; border-top: 1px solid #7d448c; margin: 30px 0;">
        
        <footer style="font-size: 13px; color: #aaaaaa;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #ffffff;">CONTROL DE MISIÓN</p>
            Si necesitas asistencia para reestablecer la comunicación, por favor contacta a nuestro equipo de soporte en tierra:<br>
            <a href="mailto:support@example.com" style="color: #edacf7; text-decoration: none; font-weight: bold;">support@example.com</a>
            <p style="font-size: 11px; margin-top: 15px;">&copy; 2023 Exploraciones LIO. Todos los derechos galácticos reservados.</p>
        </footer>
    </div>
    `;
}

export default HTMLRecoveryEmail;