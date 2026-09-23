chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ANALYZE_EMAIL") {
    fetch("http://127.0.0.1:8080/api/v1/detect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request.payload)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => sendResponse({ success: true, data: data }))
      .catch((error) => sendResponse({ success: false, error: error.message }));

    return true; // Keep message channel open for async response
  }
});