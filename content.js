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
