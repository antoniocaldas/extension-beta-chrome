chrome.storage.local.get(['script.js'], (result) => {
  if (result['script.js']) {
    const script = document.createElement('script');
    script.textContent = result['script.js'];
    document.head.appendChild(script);
  } else {
    // Cargar versión empaquetada
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('script.js');
    document.head.appendChild(script);
  }
});

// Código para cargar CSS actualizado
chrome.storage.local.get(['styles.css'], (result) => {
  const style = document.createElement('style');
  style.textContent = result['styles.css'] || '';
  document.head.appendChild(style);
});
