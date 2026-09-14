document.addEventListener('DOMContentLoaded', () => {
    const phishForm = document.getElementById('phishForm');
    const emptyState = document.getElementById('emptyState');
    const reportView = document.getElementById('reportView');
    const analyzeBtn = document.getElementById('analyzeBtn');

    // UI Elements for Report
    const riskScoreElem = document.getElementById('riskScore');
    const verdictBadge = document.getElementById('verdictBadge');
    const flagListElem = document.getElementById('flagList');

    phishForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Extract values from input fields
        const sender = document.getElementById('sender').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const emailBody = document.getElementById('emailBody').value.trim();

        if (!emailBody && !sender && !subject) {
            alert('Please enter a sender, subject, or message content to analyze.');
            return;
        }

        // 2. Set UI to Loading State
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...`;

        // 3. Temporary Mock Analysis Logic
        // (We will replace this setTimeout block with an actual fetch() call to Java/Python later)
        setTimeout(() => {
            const mockAnalysis = generateMockResult(sender, emailBody);
            
            // Render results to screen
            displayResults(mockAnalysis);

            // Reset Button State
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = `<i class="fa-solid fa-bolt"></i> Run AI Analysis`;
        }, 1200);
    });

    /**
     * Updates the DOM with the analysis results
     */
    function displayResults(data) {
        // Hide empty state placeholder and show report view
        emptyState.classList.add('hidden');
        reportView.classList.remove('hidden');

        // Update score text
        riskScoreElem.innerText = `${data.score}%`;

        // Update verdict badge text and styling
        verdictBadge.innerText = data.verdict;
        verdictBadge.style.backgroundColor = data.badgeColor;
        verdictBadge.style.color = '#ffffff';

        // Update Gauge Border Color to match threat severity
        const gaugeMeter = document.querySelector('.gauge-meter');
        gaugeMeter.style.borderColor = data.badgeColor;

        // Populate Risk Flags
        flagListElem.innerHTML = '';
        data.flags.forEach(flag => {
            const li = document.createElement('li');
            li.className = 'flag-item';
            li.style.borderLeftColor = data.badgeColor;
            li.innerText = flag;
            flagListElem.appendChild(li);
        });
    }

    /**
     * Generates temporary sample data based on user input
     */
    function generateMockResult(sender, body) {
        const textToTest = (sender + " " + body).toLowerCase();

        // Basic keyword checks for mock testing
        const containsUrgency = /urgent|suspended|verify|action required|immediately/i.test(textToTest);
        const containsSpoof = /paypa1|securit|account|login|update/i.test(textToTest);

        if (containsUrgency && containsSpoof) {
            return {
                score: 92,
                verdict: 'HIGH RISK',
                badgeColor: 'var(--danger-red)',
                flags: [
                    'Possible brand typosquatting or domain mismatch detected',
                    'High linguistic urgency metric (88% pressure sentiment)',
                    'Call-to-action requests immediate credential verification'
                ]
            };
        } else if (containsUrgency || containsSpoof) {
            return {
                score: 58,
                verdict: 'SUSPICIOUS',
                badgeColor: 'var(--warning-orange)',
                flags: [
                    'Moderate urgency wording detected in email body',
                    'Unverified sender domain reputation'
                ]
            };
        } else {
            return {
                score: 12,
                verdict: 'LOW RISK',
                badgeColor: 'var(--safe-green)',
                flags: [
                    'No aggressive urgency patterns identified',
                    'Standard communication baseline metrics passed'
                ]
            };
        }
    }
});