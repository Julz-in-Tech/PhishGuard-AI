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

        // 3. Live API Integration with Python Backend
        try {
            const response = await fetch('http://localhost:8000/api/v1/analyze', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ 
                    sender: sender, 
                    subject: subject, 
                    body: emailBody 
                })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const resultData = await response.json();
            
            // Render results directly from Python API response
            displayResults(resultData);

        } catch (error) {
            console.error('Error connecting to ML Service:', error);
            alert('Failed to connect to PhishGuard AI service. Make sure your Docker container is running at http://localhost:8000.');
        } finally {
            // Reset Button State
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = `<i class="fa-solid fa-bolt"></i> Run AI Analysis`;
        }
    });

    /**
     * Updates the DOM with the analysis results returned from the API
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
        if (data.flags && data.flags.length > 0) {
            data.flags.forEach(flag => {
                const li = document.createElement('li');
                li.className = 'flag-item';
                li.style.borderLeftColor = data.badgeColor;
                li.innerText = flag;
                flagListElem.appendChild(li);
            });
        }
    }
});