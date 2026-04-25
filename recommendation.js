document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recommendation-form');
    const resultsContainer = document.getElementById('results-container');

    // Predictor Knowledge Base (Derived from agronomic research data)
    // N, P, K in kg/ha | Rain in mm | Temp in C
    const cropDatabase = [
        { crop: "Paddy (Rice)", policy: "Authorize High-Yield Paddy Subsidies", ideal: { n: 100, p: 50, k: 50, ph: 6.2, rain: 220, temp: 28 } },
        { crop: "Wheat", policy: "Release Winter Wheat Seed Stocks", ideal: { n: 80, p: 40, k: 40, ph: 6.5, rain: 80, temp: 20 } },
        { crop: "Cotton", policy: "Promote Cash Crop (Cotton) Cultivation", ideal: { n: 70, p: 35, k: 50, ph: 6.8, rain: 90, temp: 26 } },
        { crop: "Pearl Millet (Bajra)", policy: "Issue Drought-Resistant Advisory", ideal: { n: 40, p: 30, k: 30, ph: 7.0, rain: 40, temp: 32 } },
        { crop: "Sugarcane", policy: "Approve Sugarcane Water Allocation", ideal: { n: 120, p: 60, k: 80, ph: 6.8, rain: 200, temp: 30 } },
        { crop: "Lentil", policy: "Promote Pulse Cultivation for Soil Health", ideal: { n: 20, p: 40, k: 20, ph: 6.5, rain: 60, temp: 18 } },
        { crop: "Coffee", policy: "Support Plantation Crop Financing", ideal: { n: 90, p: 30, k: 40, ph: 5.5, rain: 180, temp: 22 } },
        { crop: "Groundnut", policy: "Push Soil-Restorative Groundnut", ideal: { n: 30, p: 50, k: 40, ph: 6.0, rain: 70, temp: 25 } }
    ];

    // Max ranges from dataset for normalization calculations
    const ranges = { n: 139, p: 145, k: 205, ph: 4.0, rain: 271, temp: 33 };

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // 1. Gather Inputs
        const inputs = {
            n: parseFloat(document.getElementById('nitrogen').value),
            p: parseFloat(document.getElementById('phosphorus').value),
            k: parseFloat(document.getElementById('potassium').value),
            ph: parseFloat(document.getElementById('ph').value),
            rain: parseFloat(document.getElementById('rainfall').value),
            temp: parseFloat(document.getElementById('temperature').value)
        };

        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "Calculating Environmental Distance Matrix...";
        btn.disabled = true;

        setTimeout(() => {
            // 2. Score each crop based on distance from ideal conditions
            let scoredCrops = cropDatabase.map(data => {
                let error = 0;
                
                // Calculate normalized error for each parameter (0 to 1)
                // We weight pH, Rainfall, and Temp heavily as they are primary limiters
                error += (Math.abs(inputs.n - data.ideal.n) / ranges.n) * 0.10;
                error += (Math.abs(inputs.p - data.ideal.p) / ranges.p) * 0.10;
                error += (Math.abs(inputs.k - data.ideal.k) / ranges.k) * 0.10;
                error += (Math.abs(inputs.ph - data.ideal.ph) / ranges.ph) * 0.25; 
                error += (Math.abs(inputs.rain - data.ideal.rain) / ranges.rain) * 0.25; 
                error += (Math.abs(inputs.temp - data.ideal.temp) / ranges.temp) * 0.20;

                // Convert error to a percentage match
                let matchPercentage = Math.max(0, 100 - (error * 100)); 
                
                return { 
                    crop: data.crop,
                    policy: data.policy,
                    confidence: parseFloat(matchPercentage.toFixed(1))
                };
            });

            // Sort by highest confidence descending
            scoredCrops.sort((a, b) => b.confidence - a.confidence);

            // 3. Categorize outputs based on accuracy thresholds
            let recommended = [];
            let slightly = [];
            let notRecommended = [];

            scoredCrops.forEach(item => {
                if(item.confidence >= 80) recommended.push(item);
                else if(item.confidence >= 60) slightly.push(item);
                else notRecommended.push(item);
            });

            // 4. Update the UI
            document.getElementById('primary-directive').innerText = 
                recommended.length > 0 ? `DIRECTIVE: ${recommended[0].policy}` : "DIRECTIVE: Alert - Poor Conditions for Major Crops";

            // Helper function to format the lists
            const formatList = (arr) => {
                if(arr.length === 0) return "<p style='margin:0; font-size:13px; color:#666;'>No crops fall into this category.</p>";
                return arr.map(c => `<div class="crop-item"><strong>${c.crop}</strong> Confidence Score: ${c.confidence}%</div>`).join('');
            };

            document.getElementById('list-recommended').innerHTML = formatList(recommended);
            document.getElementById('list-slightly').innerHTML = formatList(slightly);
            document.getElementById('list-not').innerHTML = formatList(notRecommended);

            resultsContainer.style.display = "block"; 
            btn.innerText = originalText;
            btn.disabled = false;

        }, 1000); 
    });
});