chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ANALYZE_EMAIL") {
    fetch("http://localhost:8080/api/v1/detect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request.payload)
    })
      .then((response) => response.json())
      .then((data) => sendResponse({ success: true, data: data }))
      .catch((error) => sendResponse({ success: false, error: error.message }));

    return true; // Keep message channel open for async response
  }
});