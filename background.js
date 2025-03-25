const VERSION_URL =
  "https://raw.githubusercontent.com/antoniocaldas/extension-beta-chrome/refs/heads/main/manifest.json";
const FILES_TO_UPDATE = {
  "script.js":
    "https://raw.githubusercontent.com/antoniocaldas/extension-beta-chrome/refs/heads/main/script.js",
  "styles.css":
    "https://raw.githubusercontent.com/antoniocaldas/extension-beta-chrome/refs/heads/main/styles.css",
};

// ================== Lógica de Actualización ==================
async function checkForUpdates() {
  try {
    console.log('🔍 Verificando actualizaciones...');
    
    // Obtener versión local
    const localManifest = chrome.runtime.getManifest();
    const currentVersion = localManifest.version;

    // Obtener versión remota
    const remoteManifest = await fetch(VERSION_URL).then(res => res.json());
    const latestVersion = remoteManifest.version;

    if (currentVersion !== latestVersion) {
      console.log(`🚀 Nueva versión disponible: ${latestVersion}`);
      await updateFiles();
      return true;
    }
    console.log('✅ Ya tienes la última versión');
    return false;
  } catch (error) {
    console.error('❌ Error al verificar actualizaciones:', error);
    throw error;
  }
}

async function updateFiles() {
  try {
    console.log('⬇️ Descargando archivos actualizados...');
    
    for (const [fileName, fileUrl] of Object.entries(FILES_TO_UPDATE)) {
      const content = await fetch(fileUrl).then(res => res.text());
      await saveFileToStorage(fileName, content);
    }

    // 🔥 Notificar a todas las pestañas que recarguen los recursos
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          action: "NEW_UPDATE_AVAILABLE",
          files: Object.keys(FILES_TO_UPDATE)
        }).catch(() => {}); // Ignora errores en pestañas sin content script
      });
    });

  } catch (error) {
    console.error('❌ Error al actualizar archivos:', error);
    throw error;
  }
}

function saveFileToStorage(fileName, content) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [fileName]: content }, () => {
      console.log(`💾 ${fileName} guardado en storage`);
      resolve();
    });
  });
}

// ================== Comunicación con el Botón ==================
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateExtension") {
    (async () => {
      try {
        const updated = await checkForUpdates();
        sendResponse({ 
          success: true, 
          updated: updated,
          message: updated ? "Extensión actualizada" : "Ya tienes la última versión"
        });
      } catch (error) {
        sendResponse({ 
          success: false, 
          error: error.message 
        });
      }
    })();
    return true; // Mantiene el canal abierto para sendResponse
  }
});

// ================== Actualización Automática Periódica ==================
// Verifica cada 24 horas (opcional)
const ALARM_NAME = 'auto-update-check';
chrome.alarms.create(ALARM_NAME, { periodInMinutes: 24 * 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    checkForUpdates().catch(console.error);
  }
});

// Verificar al iniciar
checkForUpdates().catch(console.error);