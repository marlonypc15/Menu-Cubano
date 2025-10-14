# Menú Cubano - Web App

Archivos: index.html, styles.css, app.js, backend/

Despliegue frontend en GitHub Pages:
1. Crear repo en GitHub y subir los archivos del proyecto.
2. En Settings > Pages seleccionar branch `main` y carpeta `/ (root)` para publicar. GitHub generará la URL pública.

Subir backend:
1. Subir la carpeta backend a un repo separado.
2. Desplegar en Railway, Render o Heroku con variables NODE_ENV si es necesario.
3. Conectar frontend para enviar POST a `https://TU_BACKEND/api/orders`.

Generar ZIP (local):
- Linux/macOS: `zip -r menu-cubano.zip index.html styles.css app.js backend/`
- Windows PowerShell: `Compress-Archive -Path * -DestinationPath menu-cubano.zip`

Compartir por WhatsApp:
- Usa el botón en la app que abre wa.me con el ticket pre-llenado. Para vistas previas y mejor compatibilidad usa una URL HTTPS y acorta si quieres.

Notas:
- GitHub Pages soporta solo sitios estáticos; para backend usa otros hosts recomendados como Netlify (front) + serverless o Railway/Render (backend).