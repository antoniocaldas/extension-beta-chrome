const VERSION_URL =
  "https://raw.githubusercontent.com/antoniocaldas/extension-beta-chrome/refs/heads/main/manifest.json";
const FILES_TO_UPDATE = {
  "script.js":
    "https://raw.githubusercontent.com/antoniocaldas/extension-beta-chrome/refs/heads/main/script.js",
  "styles.css":
    "https://raw.githubusercontent.com/antoniocaldas/extension-beta-chrome/refs/heads/main/styles.css",
};

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
