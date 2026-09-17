# 📱 Guía de Configuración - LioSnack26 (Desarrollo Local)

## 🔧 Configuración para Desarrollo Local

### Backend

1. **Asegúrate de tener `.env` en la carpeta `backend/`** con las siguientes variables:

```env
DB_URI=mongodb://...
PORT=4000
JWT_SECRET_KEY=tu_secret_key
USER_EMAIL=tu_email
USER_PASSWORD=tu_password
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GRANT_TYPE=...
AUDIENCE=...
CLIENT_ID=...
CLIENT_SECRET=...
API_KEY_MAILJET=...
API_SECRET_MAILJET=...
MAILJET_FROM_EMAIL=...
MAILJET_FROM_NAME=...
CORS_ORIGIN=http://192.168.1.X:4000  # (Opcional) Tu IP local si necesitas desde otro dispositivo
```

2. **Inicia el servidor:**
```bash
cd backend
npm install  # Si es la primera vez
npm run dev
```

---

### Frontend - LioAdmin

1. **Archivo `.env` ya está creado en `frontend/LioAdmin/.env`:**

```env
VITE_API_URL=http://localhost:4000/api
```

Si necesitas conectar desde otra IP:
```env
VITE_API_URL=http://192.168.1.X:4000/api
```

2. **Inicia el servidor:**
```bash
cd frontend/LioAdmin
npm install  # Si es la primera vez
npm run dev
```

El servidor correrá en `http://localhost:5173`

---

### Frontend - LioSnacks_Web

1. **Ya tiene configuración correcta en `.env`:**

```env
VITE_API_URL=http://localhost:4000/api
```

2. **Inicia el servidor:**
```bash
cd frontend/LioSnacks_Web
npm install  # Si es la primera vez
npm run dev
```

El servidor correrá en `http://localhost:5173` (o el siguiente puerto disponible)

---

## 📲 Mobile - Conexión Local (IMPORTANTE)

### Paso 1: Obtener tu IP Local

#### En Windows (PowerShell):
```powershell
ipconfig
```
Busca "IPv4 Address" en la sección de tu adaptador de red Wi-Fi. Ej: `192.168.1.X`

#### En Mac/Linux:
```bash
ifconfig | grep "inet " | grep -v "127.0.0.1"
```

### Paso 2: Configurar la Mobile

Edita o crea el archivo `.env` en la raíz del proyecto mobile:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.X:4000/api
EXPO_PUBLIC_LOCAL_IP=192.168.1.X
```

Reemplaza `192.168.1.X` con tu IP local real.

### Paso 3: Inicia la app

```bash
cd mobile
npm install  # Si es la primera vez
npm start
```

Luego en Expo Go:
- **Android**: Escanea el código QR con tu teléfono
- **iOS**: Escanea el código QR con la cámara
- **Web**: Presiona `w` en la terminal

---

## ✅ Verificación de Conectividad

### Desde tu computadora:

1. **Verifica que el backend esté corriendo:**
```bash
curl http://localhost:4000/api/productos
```

Deberías ver una respuesta JSON.

2. **Verifica CORS:**
```bash
curl -H "Origin: http://localhost:5173" http://localhost:4000/api/productos
```

### Desde el dispositivo móvil o emulador:

1. **Verifica conexión a la IP local:**
```bash
# En la terminal del móvil (si tiene acceso)
curl http://192.168.1.X:4000/api/productos
```

2. **Verifica que el móvil esté en la misma red Wi-Fi que la computadora**

---

## 🔄 Cambios Realizados Automáticamente

### ✅ Backend (`backend/app.js`)
- CORS ahora permite `localhost` y `127.0.0.1` en puertos `3000` y `5173`
- Soporta variable de entorno `CORS_ORIGIN` para IPs personalizadas

### ✅ LioAdmin (`frontend/LioAdmin/src/utils/apiUrl.js`)
- Ahora usa variable de entorno `VITE_API_URL`
- Fallback a `http://localhost:4000/api` si no está configurada
- Archivo `.env` ya creado

### ✅ Mobile (`mobile/src/config/api.js`)
- Ahora soporta variables de entorno `EXPO_PUBLIC_API_URL` y `EXPO_PUBLIC_LOCAL_IP`
- Permite configuración dinámica sin hardcodear

### ✅ LioSnacks_Web
- Ya estaba correctamente configurado ✓

---

## 🚀 Comandos Rápidos para Desarrollo

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - LioAdmin
cd frontend/LioAdmin && npm run dev

# Terminal 3 - LioSnacks_Web
cd frontend/LioSnacks_Web && npm run dev

# Terminal 4 - Mobile
cd mobile && npm start
```

---

## 🐛 Troubleshooting

### "No se puede conectar al servidor" en LioAdmin

1. Verifica que VITE_API_URL en `.env` sea correcto
2. Verifica que el backend esté corriendo en el puerto 4000
3. Recarga la página: `Ctrl+R` o `Cmd+R`

### El móvil no se conecta

1. Verifica tu IP local correcta con `ipconfig`
2. Asegúrate de que el móvil esté en la misma red Wi-Fi
3. Verifica que CORS esté permitido: `CORS_ORIGIN=http://192.168.1.X:4000`
4. Reinicia Expo Go

### Error CORS

Si ves error "CORS Policy", puede ser:
1. La URL en el `.env` es incorrecta
2. El backend no tiene permitida esa origen
3. Agrega la URL a `CORS_ORIGIN` en el `.env` del backend

---

## 📦 Producción

Para producción, asegúrate de actualizar:
- Backend: URL real de la API
- LioAdmin: `VITE_API_URL=https://api.produccion.com`
- LioSnacks_Web: `.env` con URL de producción
- Mobile: `EXPO_PUBLIC_API_URL=https://api.produccion.com`

