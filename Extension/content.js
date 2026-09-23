console.log("🚀 PhishGuard AI: Content Script Successfully Loaded into Gmail!");

let currentEmailId = "";

function injectThreatBanner(data) {
  console.log("🛡️ PhishGuard AI: Injecting Threat Banner:", data);
  const existingBanner = document.getElementById("phishguard-banner");
  if (existingBanner) existingBanner.remove();

  const isPhishing = data.verdict === "POSSIBLE_PHISHING";
  const bannerColor = isPhishing ? "#dc2626" : "#059669";
  const backgroundColor = isPhishing ? "#fef2f2" : "#ecfdf5";

  const banner = document.createElement("div");
  banner.id = "phishguard-banner";
  banner.style.cssText = `
    margin: 12px 0;
    padding: 12px 16px;
    border-radius: 8px;
    background-color: ${backgroundColor};
    border: 1px solid ${bannerColor};
    color: ${bannerColor};
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 99999;
  `;

  banner.innerHTML = `
    <span>🛡️ PhishGuard AI Analysis: ${data.verdict} (Risk Score: ${data.score}%)</span>
    <span style="font-size: 12px; font-weight: normal;">Flags: ${data.flags ? data.flags.join(", ") : "None"}</span>
  `;

  // Inject at the top of the open email container or header
  const header = document.querySelector(".ha") || document.querySelector(".nH[role='main']") || document.body;
  if (header) {
    header.prepend(banner);
  }
}

function processActiveEmail() {
  const senderNode = document.querySelector(".gD");
  const subjectNode = document.querySelector("h2.hP");
  const bodyNode = document.querySelector(".a3s");

  if (!senderNode || !bodyNode) return;

  const sender = senderNode.getAttribute("email") || senderNode.innerText;
  const subject = subjectNode ? subjectNode.innerText : "";
  const body = bodyNode.innerText;

  const emailIdentifier = sender + subject;
  if (emailIdentifier === currentEmailId) return;
  currentEmailId = emailIdentifier;

  console.log("🛡️ PhishGuard AI: Detected Open Email ->", { sender, subject });

  const payload = { sender, subject, body };

  chrome.runtime.sendMessage({ action: "ANALYZE_EMAIL", payload }, (response) => {
    console.log("🛡️ PhishGuard AI: Service Worker Response ->", response);
    if (response && response.success) {
      injectThreatBanner(response.data);
    } else {
      console.error("🛡️ PhishGuard AI Error:", response?.error);
    }
  });
}

// Observe Gmail DOM mutations continuously for email navigation
const observer = new MutationObserver(() => processActiveEmail());
observer.observe(document.body, { childList: true, subtree: true });