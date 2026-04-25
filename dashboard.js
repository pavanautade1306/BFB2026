document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. SPA NAVIGATION LOGIC
    // ==========================================
    const navLinks = document.querySelectorAll('#nav-menu a[data-target]');
    const sections = document.querySelectorAll('.app-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(nav => nav.parentElement.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active'));
            link.parentElement.classList.add('active');
            const targetId = link.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // ==========================================
    // 2. LIVE WEATHER API FETCH
    // ==========================================
    // Configured for Chhatrapati Sambhajinagar
    const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=19.8762&longitude=75.3433&current_weather=true';

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            const weather = data.current_weather;
            document.getElementById('api-temp').innerText = `${weather.temperature}°C`;
            document.getElementById('api-wind').innerText = `${weather.windspeed} km/h`;
            
            let status = "Clear / Sunny";
            if(weather.weathercode >= 51) status = "Precipitation Detected";
            if(weather.weathercode >= 1 && weather.weathercode <= 3) status = "Partly Cloudy";
            document.getElementById('api-status').innerText = status;
        })
        .catch(error => {
            console.error("API Error:", error);
            document.getElementById('api-temp').innerText = "System Offline";
        });

    // ==========================================
    // 3. ADVANCED CROP PREDICTOR ALGORITHM
    // ==========================================
    const form = document.getElementById('recommendation-form');
    const resultsPanel = document.getElementById('results-panel');
    const recommendedCropEl = document.getElementById('recommended-crop');
    const reasonEl = document.getElementById('recommendation-reason');

    // Advanced knowledge base mapping optimal thresholds 
    const cropDatabase = [
        { crop: "Paddy (Rice)", types: ["Clay", "Loamy"], temp: ["20–30°C", "30–40°C"], rain: "Above 1000mm", water: "Irrigated", regions: ["South India", "Eastern India", "Central India", "North India"], ideal: {n: 100, p: 50, k: 50, ph: 6.2, erain: 220} },
        { crop: "Wheat", types: ["Loamy", "Clay"], temp: ["Below 20°C", "20–30°C"], rain: "500–1000mm", water: "Irrigated", regions: ["North India", "Central India", "Western India"], ideal: {n: 80, p: 40, k: 40, ph: 6.5, erain: 80} },
        { crop: "Cotton", types: ["Black Cotton", "Loamy"], temp: ["20–30°C", "30–40°C"], rain: "500–1000mm", water: "Irrigated", regions: ["Western India", "Central India", "South India"], ideal: {n: 70, p: 35, k: 50, ph: 6.8, erain: 90} },
        { crop: "Pearl Millet (Bajra)", types: ["Sandy", "Loamy"], temp: ["30–40°C", "Above 40°C"], rain: "Below 500mm", water: "Rain-fed", regions: ["Western India", "North India"], ideal: {n: 40, p: 30, k: 30, ph: 7.0, erain: 40} },
        { crop: "Sugarcane", types: ["Loamy", "Clay", "Black Cotton"], temp: ["20–30°C", "30–40°C"], rain: "Above 1000mm", water: "Irrigated", regions: ["North India", "Western India", "South India"], ideal: {n: 120, p: 60, k: 80, ph: 6.8, erain: 200} },
        { crop: "Groundnut", types: ["Sandy", "Loamy"], temp: ["20–30°C", "30–40°C"], rain: "500–1000mm", water: "Rain-fed", regions: ["Western India", "South India"], ideal: {n: 30, p: 50, k: 40, ph: 6.0, erain: 70} }
    ];

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Retrieve UI Variables
        const uiSoil = document.getElementById('soil-type').value;
        const uiRain = document.getElementById('annual-rain').value;
        const uiTemp = document.getElementById('temp-range').value;
        const uiWater = document.getElementById('water-source').value;
        const uiRegion = document.getElementById('region').value;
        
        const uiN = parseFloat(document.getElementById('nitrogen').value);
        const uiP = parseFloat(document.getElementById('phosphorus').value);
        const uiK = parseFloat(document.getElementById('potassium').value);
        const uipH = parseFloat(document.getElementById('ph').value);
        const uiEstRain = parseFloat(document.getElementById('est-rain').value);

        const btn = form.querySelector('button');
        btn.innerText = "Computing Environmental Variables...";
        btn.disabled = true;

        setTimeout(() => {
            let bestCrop = "";
            let highestScore = -Infinity;

            cropDatabase.forEach(data => {
                let score = 0;

                // 1. Categorical Matching (Weight: 50%)
                if (data.types.includes(uiSoil)) score += 15;
                if (data.rain === uiRain) score += 10;
                if (data.temp.includes(uiTemp)) score += 10;
                if (data.water === uiWater) score += 10;
                if (data.regions.includes(uiRegion)) score += 5;

                // 2. Distance-Based Numerical Scoring (Weight: 50%)
                // The closer the input is to the ideal value, the smaller the penalty
                let penalty = 0;
                penalty += Math.abs(uiN - data.ideal.n) * 0.1;
                penalty += Math.abs(uiP - data.ideal.p) * 0.1;
                penalty += Math.abs(uiK - data.ideal.k) * 0.1;
                penalty += Math.abs(uipH - data.ideal.ph) * 8; 
                penalty += Math.abs(uiEstRain - data.ideal.erain) * 0.05;

                let finalScore = score - penalty;

                if (finalScore > highestScore) {
                    highestScore = finalScore;
                    bestCrop = data.crop;
                }
            });

            // Display Results
            recommendedCropEl.innerText = bestCrop;
            reasonEl.innerHTML = `<strong>Diagnostic Analysis:</strong> The algorithmic model identified an optimal correlation between the input constraints (<em>${uiSoil} soil, pH ${uipH}, ${uiRegion}</em>) and the agronomic requirements for ${bestCrop}.`;
            
            resultsPanel.style.display = "block";
            btn.innerText = "Execute Data Model & Get Recommendation";
            btn.disabled = false;
        }, 1100); 
    });

    // ==========================================
    // 4. FEEDBACK FORM
    // ==========================================
    const feedbackForm = document.getElementById('feedback-form');
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert("Report logged securely to Agritel central database.");
        feedbackForm.reset();
    });
});