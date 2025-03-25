document.getElementById("updateButton").addEventListener("click", async () => {
  const button = document.getElementById("updateButton");
  button.disabled = true;
  button.textContent = "Actualizando...";

  try {
    const response = await chrome.runtime.sendMessage({
      action: "updateExtension", // ✔️ Envía un mensaje al background.js
    });

    if (response?.success) {
      alert("✅ Extensión actualizada. Recarga las pestañas donde la uses.");
    } else {
      alert("ℹ️ No hay actualizaciones o ocurrió un error.");
    }
  } catch (error) {
    console.error("Error al actualizar:", error);
    alert("❌ Error al actualizar la extensión");
  } finally {
    button.disabled = false;
    button.textContent = "Actualizar Extensión";
  }
});
