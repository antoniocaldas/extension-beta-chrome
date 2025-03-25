document.getElementById("updateButton").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "updateExtension" });
});
