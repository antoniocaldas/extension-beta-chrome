chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "reloadAssets") {
      chrome.storage.local.get(["styles.css", "script.js"], (data) => {
        // 🔹 ACTUALIZAR CSS
        if (data["styles.css"]) {
          let oldStyle = document.getElementById("custom-style");
          if (oldStyle) oldStyle.remove();
  
          const style = document.createElement("style");
          style.id = "custom-style";
          style.textContent = data["styles.css"];
          document.head.appendChild(style);
          console.log("✅ CSS actualizado dinámicamente.");
        }
  
        // 🔹 ACTUALIZAR JS
        if (data["script.js"]) {
          let oldScript = document.getElementById("custom-script");
          if (oldScript) oldScript.remove();
  
          const script = document.createElement("script");
          script.id = "custom-script";
          script.textContent = data["script.js"];
          document.body.appendChild(script);
          console.log("✅ JS actualizado dinámicamente.");
        }
      });
    }
  });