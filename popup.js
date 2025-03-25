document.getElementById("updateButton").addEventListener("click", async () => {
  const button = document.getElementById("updateButton");
  button.disabled = true;
  button.textContent = "Actualizando...";

  try {
    const response = await chrome.runtime.sendMessage({
      action: "updateExtension",
    });

    if (response && response.success) {
      alert(
        "✅ Extensión actualizada correctamente. Por favor, recarga las pestañas donde la uses."
      );
    } else {
      alert("ℹ️ No hay actualizaciones disponibles o ocurrió un error.");
    }
  } catch (error) {
    console.error("Error al actualizar:", error);
    alert("❌ Error al actualizar la extensión");
  } finally {
    button.disabled = false;
    button.textContent = "Actualizar Extensión";
  }
});
