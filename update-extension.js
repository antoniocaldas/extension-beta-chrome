const fs = require("fs");
const https = require("https");
const path = require("path");

// 🔹 URLs RAW de los archivos en GitHub (o cualquier otra fuente pública)
const VERSION_URL =
  "https://raw.githubusercontent.com/antoniocaldas/extension-beta-chrome/refs/heads/main/manifest.json";
const FILES_TO_UPDATE = {
  "script.js":
    "https://raw.githubusercontent.com/antoniocaldas/extension-beta-chrome/refs/heads/main/script.js",
  "style.css":
    "https://raw.githubusercontent.com/antoniocaldas/extension-beta-chrome/refs/heads/main/styles.css",
  "popup.html":
    "https://raw.githubusercontent.com/antoniocaldas/extension-beta-chrome/refs/heads/main/popup.html",
};

// 📂 Carpeta donde están los archivos de la extensión
const EXTENSION_FOLDER = __dirname; // Cambia esto si tu estructura es diferente

async function checkForUpdate() {
  try {
    console.log("🔍 Verificando actualizaciones...");

    // 📝 Obtiene la última versión publicada
    const versionData = await fetchJSON(VERSION_URL);
    const currentVersion = getCurrentVersion();
    const latestVersion = versionData.version;

    if (currentVersion !== latestVersion) {
      console.log(`🚀 Nueva versión disponible: ${latestVersion}`);
      await updateFiles();
    } else {
      console.log("✅ La extensión ya está actualizada.");
    }
  } catch (error) {
    console.error("❌ Error al verificar la actualización:", error);
  }
}
function getCurrentVersion() {
  const manifestPath = path.join(EXTENSION_FOLDER, "manifest.json");

  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    return manifest.version;
  }
  return "0.0.0";
}

// 🔄 Obtiene un JSON remoto
async function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(JSON.parse(data)));
      })
      .on("error", reject);
  });
}

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
checkForUpdate();
