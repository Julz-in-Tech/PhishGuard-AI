// Extract email content and send to background script
function analyzeCurrentEmail() {
  const emailHeader = document.querySelector('h2[data-thread-perm-id]');
  if (!emailHeader || document.getElementById("phishguard-banner")) return;

  // Extract Sender, Subject, and Body
  const subject = emailHeader.innerText || "";
  
  const senderNode = document.querySelector('span[email]');
  const sender = senderNode ? senderNode.getAttribute('email') : "";

  const bodyNode = document.querySelector('div[data-message-id] .a3s');
  const body = bodyNode ? bodyNode.innerText : "";

  if (!subject && !body) return;

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

function injectThreatBanner(data) {
  if (document.getElementById("phishguard-banner")) return;

  const emailHeader = document.querySelector('h2[data-thread-perm-id]');
  if (!emailHeader) return;

  const banner = document.createElement("div");
  banner.id = "phishguard-banner";

  const score = data.score || 0;
  const verdict = (data.verdict || "").toUpperCase();

  // Dynamic Color Scheme
  let bgColor, borderColor, textColor;

  if (score >= 70 || verdict.includes("HIGH") || verdict.includes("PHISHING")) {
    // 🔴 HIGH RISK - RED
    bgColor = "#fce8e6";
    borderColor = "#d93025";
    textColor = "#a50e0e";
  } else if (score >= 30 || verdict.includes("SUSPICIOUS") || verdict.includes("MEDIUM")) {
    // 🟠 MEDIUM RISK - ORANGE / YELLOW
    bgColor = "#fef7e0";
    borderColor = "#f2994a";
    textColor = "#b06000";
  } else {
    // 🟢 LOW RISK - GREEN
    bgColor = "#e6f4ea";
    borderColor = "#1e8e3e";
    textColor = "#137333";
  }

  banner.style.cssText = `
    background-color: ${bgColor};
    border-left: 6px solid ${borderColor};
    border-top: 1px solid ${borderColor};
    border-right: 1px solid ${borderColor};
    border-bottom: 1px solid ${borderColor};
    color: ${textColor};
    padding: 10px 16px;
    margin: 10px 0;
    border-radius: 8px;
    font-family: 'Google Sans', Roboto, sans-serif;
    font-size: 14px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  `;

  let flagsContent = "";
  if (Array.isArray(data.flags) && data.flags.length > 0) {
    flagsContent = data.flags.map(flag => `<li>${flag}</li>`).join("");
  } else if (typeof data.flags === "string") {
    flagsContent = `<li>${data.flags}</li>`;
  } else {
    flagsContent = "<li>No threat indicators found</li>";
  }

  banner.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <strong style="font-size: 15px;">🛡️ PhishGuard AI: ${data.verdict} (Risk Score: ${score}%)</strong>
    </div>
    <ul style="margin: 6px 0 0 18px; padding: 0;">
      ${flagsContent}
    </ul>
  `;

  emailHeader.parentElement.insertBefore(banner, emailHeader);
}

// Observe Gmail DOM changes when switching emails
const observer = new MutationObserver(() => {
  analyzeCurrentEmail();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Run initial check
analyzeCurrentEmail();