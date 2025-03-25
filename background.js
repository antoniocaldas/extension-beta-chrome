const VERSION_URL =
  "https://raw.githubusercontent.com/antoniocaldas/extension-beta-chrome/refs/heads/main/manifest.json";
const FILES_TO_UPDATE = {
  "script.js":
    "https://raw.githubusercontent.com/antoniocaldas/extension-beta-chrome/refs/heads/main/script.js",
  "styles.css":
    "https://raw.githubusercontent.com/antoniocaldas/extension-beta-chrome/refs/heads/main/styles.css",
};
// Función para descargar archivos
async function fetchFile(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.text();
    } catch (error) {
      console.error(`Error al descargar ${url}:`, error);
      return null;
    }
  }
  
  // Función para actualizar archivos locales
  async function updateLocalFiles() {
    console.log("🔄 Actualizando archivos locales...");
    
    try {
      // Descargar todos los archivos
      const updates = {};
      for (const [filename, url] of Object.entries(FILES_TO_UPDATE)) {
        const content = await fetchFile(url);
        if (content) {
          updates[filename] = content;
        }
      }
  
      // Guardar en chrome.storage.local
      await chrome.storage.local.set(updates);
      console.log("✅ Archivos actualizados en chrome.storage.local");
  
      // Actualizar el service worker (background.js)
      if (updates["background.js"]) {
        const newBgScript = updates["background.js"];
        const blob = new Blob([newBgScript], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        
        // Registrar el nuevo service worker
        await chrome.runtime.reload();
        console.log("🔄 Service Worker recargado");
      }
  
      return true;
    } catch (error) {
      console.error("❌ Error al actualizar archivos:", error);
      return false;
    }
  }
  
  // Verificar actualizaciones
  async function checkForUpdate() {
    try {
      // Obtener versión actual del manifest
      const currentVersion = chrome.runtime.getManifest().version;
  
      // Obtener versión remota
      const response = await fetch(VERSION_URL);
      const versionData = await response.json();
      const latestVersion = versionData.version;
  
      if (currentVersion !== latestVersion) {
        console.log(`🚀 Nueva versión disponible: ${latestVersion}`);
        return await updateLocalFiles();
      } else {
        console.log("✅ Ya tienes la última versión");
        return false;
      }
    } catch (error) {
      console.error("❌ Error al verificar actualización:", error);
      return false;
    }
  }
  
  // Manejar mensajes desde el popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateExtension") {
      checkForUpdate().then(success => {
        sendResponse({ success });
      });
      return true; // Indica que responderemos asincrónicamente
    }
  });
  
  // Verificar actualización al iniciar
  checkForUpdate();