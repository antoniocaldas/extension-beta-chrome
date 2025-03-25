loadResources();

// Escuchar mensajes del background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "NEW_UPDATE_AVAILABLE") {
    console.log("🔄 Recargando recursos actualizados...");
    loadResources(); // Vuelve a cargar todo
  }
});

function loadResources() {
  // Limpiar recursos antiguos (opcional)
  document.querySelectorAll('[data-dynamic-resource]').forEach(el => el.remove());

  // Cargar script.js
  chrome.storage.local.get(['script.js'], (result) => {
    const script = document.createElement('script');
    script.setAttribute('data-dynamic-resource', 'true');
    script.textContent = result['script.js'] || '';
    document.head.appendChild(script);
  });

  // Cargar styles.css
  chrome.storage.local.get(['styles.css'], (result) => {
    const style = document.createElement('style');
    style.setAttribute('data-dynamic-resource', 'true');
    style.textContent = result['styles.css'] || '';
    document.head.appendChild(style);
  });
}
