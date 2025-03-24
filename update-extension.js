const fs = require("fs");
const https = require("https");
const path = require("path");

// 🔹 URLs RAW de los archivos en GitHub (o cualquier otra fuente pública)
const FILES_TO_UPDATE = {
  "script.js": "",
  "style.css": "",
  "popup.html": "",
};

// 📂 Carpeta donde están los archivos de la extensión
const EXTENSION_FOLDER = __dirname; // Cambia esto si tu estructura es diferente

async function updateFile(fileName, fileUrl) {
  return new Promise((resolve, reject) => {
    https
      .get(fileUrl, (response) => {
        if (response.statusCode !== 200) {
          return reject(
            new Error(`Error al obtener ${fileUrl}: ${response.statusCode}`)
          );
        }

        let content = "";
        response.on("data", (chunk) => {
          content += chunk;
        });

        response.on("end", () => {
          const filePath = path.join(EXTENSION_FOLDER, fileName);
          fs.writeFileSync(filePath, content, "utf8");
          console.log(`✅ ${fileName} actualizado correctamente.`);
          resolve();
        });
      })
      .on("error", (err) => reject(err));
  });
}

// Función para actualizar los archivos
async function updateFiles() {
  try {
    for (const [fileName, fileUrl] of Object.entries(FILES_TO_UPDATE)) {
      console.log(`🔽 Obteniendo nueva versión de ${fileName}...`);
      await updateFile(fileName, fileUrl);
    }

    reloadExtension();
  } catch (error) {
    console.error("❌ Error al actualizar archivos:", error);
  }
}

// 🚀 Ejecutar actualización
updateFiles();
