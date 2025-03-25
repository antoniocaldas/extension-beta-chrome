<<<<<<< HEAD
// Cargar assets iniciales desde chrome.storage
loadAssets();

// Escuchar mensajes para recargar assets
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "reloadAssets") {
    loadAssets();
    sendResponse({ success: true });
  }
  return true;
});

// Función para cargar/recargar assets
function loadAssets() {
  chrome.storage.local.get(["styles.css", "script.js"], (data) => {
    // Actualizar CSS
    updateStyle(data["styles.css"]);

    // Actualizar JS
    updateScript(data["script.js"]);
  });
}

function updateStyle(cssContent) {
  if (!cssContent) return;

  let style = document.getElementById("custom-style");
  if (style) {
    style.textContent = cssContent;
  } else {
    style = document.createElement("style");
    style.id = "custom-style";
    style.textContent = cssContent;
    document.head.appendChild(style);
  }
}

function updateScript(jsContent) {
  if (!jsContent) return;

  let script = document.getElementById("custom-script");
  if (script) {
    script.remove();
  }

  script = document.createElement("script");
  script.id = "custom-script";
  script.textContent = jsContent;
  document.body.appendChild(script);
}
=======
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
>>>>>>> main-beta
