const VERSION_URL =
  "https://raw.githubusercontent.com/antoniocaldas/extension-beta-chrome/refs/heads/main/manifest.json";
const FILES_TO_UPDATE = {
  "script.js":
    "https://raw.githubusercontent.com/antoniocaldas/extension-beta-chrome/refs/heads/main/script.js",
  "styles.css":
    "https://raw.githubusercontent.com/antoniocaldas/extension-beta-chrome/refs/heads/main/styles.css",
};
<<<<<<< HEAD
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
=======

async function checkForUpdate() {
  try {
    console.log("🔍 Verificando actualizaciones...");

    const versionData = await fetchJSON(VERSION_URL);
    const currentVersion = await getCurrentVersion();
    const latestVersion = versionData.version;

    if (currentVersion !== latestVersion) {
      console.log(`🚀 Nueva versión detectada: ${latestVersion}`);
      await updateFiles();
      await saveVersion(latestVersion);
      notifyContentScripts();
    } else {
      console.log("✅ La extensión está actualizada.");
    }
  } catch (error) {
    console.error("❌ Error al verificar la actualización:", error);
  }
}

// 📌 Obtiene la versión guardada en `chrome.storage`
function getCurrentVersion() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["extension_version"], (result) => {
      resolve(result.extension_version || "0.0.0");
    });
  });
}

// 📌 Guarda la nueva versión en `chrome.storage`
function saveVersion(version) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ extension_version: version }, () => resolve());
  });
}

// 📌 Descarga un archivo y lo guarda en `chrome.storage`
async function updateFile(fileName, fileUrl) {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error(`Error al descargar ${fileUrl}`);
    const content = await response.text();

    await chrome.storage.local.set({ [fileName]: content });
    console.log(`✅ ${fileName} actualizado.`);
  } catch (error) {
    console.error(`❌ Error al actualizar ${fileName}:`, error);
  }
}

// 📌 Descarga y guarda todos los archivos
async function updateFiles() {
  await Promise.all(
    Object.entries(FILES_TO_UPDATE).map(([fileName, fileUrl]) =>
      updateFile(fileName, fileUrl)
    )
  );
}

// 📌 Envía un mensaje a los scripts activos para que recarguen los archivos
function notifyContentScripts() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: reloadUpdatedFiles,
      });
    });
  });
}

// 📌 Función que recargará los archivos en los scripts activos
function reloadUpdatedFiles() {
  chrome.storage.local.get(["script.js", "styles.css"], (data) => {
    if (data["script.js"]) {
      const script = document.createElement("script");
      script.textContent = data["script.js"];
      document.body.appendChild(script);
    }

    if (data["styles.css"]) {
      const style = document.createElement("style");
      style.textContent = data["styles.css"];
      document.head.appendChild(style);
    }
  });
}

// 📌 Obtiene un JSON remoto
async function fetchJSON(url) {
  const response = await fetch(url);
  return response.json();
}

checkForUpdate();
>>>>>>> main-beta
