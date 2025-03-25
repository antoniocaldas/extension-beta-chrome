const VERSION_URL =
  "https://raw.githubusercontent.com/antoniocaldas/extension-beta-chrome/refs/heads/main/manifest.json";
const FILES_TO_UPDATE = {
  "script.js":
    "https://raw.githubusercontent.com/antoniocaldas/extension-beta-chrome/refs/heads/main/script.js",
  "styles.css":
    "https://raw.githubusercontent.com/antoniocaldas/extension-beta-chrome/refs/heads/main/styles.css",
};

async function fetchText(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error al obtener ${url}`);
    return await response.text();
  } catch (error) {
    console.error("❌ Error al descargar archivo:", error);
    return null;
  }
}

async function checkForUpdate() {
  console.log("🔍 Verificando actualizaciones...");

  try {
    const response = await fetch(VERSION_URL);
    const versionData = await response.json();
    const latestVersion = versionData.version;

    chrome.storage.local.get("extensionVersion", async (data) => {
      const currentVersion = data.extensionVersion || "0.0.0";

      if (currentVersion !== latestVersion) {
        console.log(`🚀 Nueva versión disponible: ${latestVersion}`);

        let updates = { extensionVersion: latestVersion };

        for (const [file, url] of Object.entries(FILES_TO_UPDATE)) {
          const content = await fetchText(url);
          if (content) updates[file] = content;
        }

        chrome.storage.local.set(updates, () => {
          console.log("✅ Archivos actualizados en chrome.storage");
        });
      } else {
        console.log("✅ La extensión ya está actualizada.");
      }
    });
  } catch (error) {
    console.error("❌ Error al verificar actualización:", error);
  }
}

// Escucha el mensaje desde el popup
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "updateExtension") {
    checkForUpdate();
  }
});

// Ejecutar la verificación al iniciar
checkForUpdate();
