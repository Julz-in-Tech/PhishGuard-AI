let currentEmailId = "";

function injectThreatBanner(data) {
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
  `;

  banner.innerHTML = `
    <span>🛡️ PhishGuard AI Analysis: ${data.verdict} (Risk Score: ${data.score}%)</span>
    <span style="font-size: 12px; font-weight: normal;">Flags: ${data.flags.join(", ") || "None"}</span>
  `;

  const header = document.querySelector(".ha");
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

  const payload = { sender, subject, body };

  chrome.runtime.sendMessage({ action: "ANALYZE_EMAIL", payload }, (response) => {
    if (response && response.success) {
      injectThreatBanner(response.data);
    }
  });
}

const observer = new MutationObserver(() => processActiveEmail());
observer.observe(document.body, { childList: true, subtree: true });