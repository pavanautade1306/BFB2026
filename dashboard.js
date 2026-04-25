function loadDashboardData() {
    const temps = [28, 30, 32, 35, 38];
    // Notice how the moisture data is now described as "zones" or percentages
    const moistures = [
        "75% Zones Optimal", 
        "Drought Alert: North Block", 
        "Adequate Basin Levels", 
        "Flood Risk: South Block"
    ];
    const markets = [
        { crop: "Cotton Index", trend: "Surplus -2%", color: "#d32f2f" },
        { crop: "Soybean Index", trend: "Deficit +4%", color: "#2E7D32" },
        { crop: "Wheat Index", trend: "Stable 0%", color: "#555" },
        { crop: "Maize Index", trend: "High Demand +5%", color: "#2E7D32" }
    ];

    const currentTemp = temps[Math.floor(Math.random() * temps.length)];
    const currentHumidity = Math.floor(Math.random() * (85 - 40 + 1) + 40); 
    const currentMoisture = moistures[Math.floor(Math.random() * moistures.length)];
    const currentMarket = markets[Math.floor(Math.random() * markets.length)];

    document.getElementById("weather-val").innerText = `${currentTemp}°C Avg`;
    document.getElementById("weather-desc").innerText = `Mean Humidity: ${currentHumidity}%`;
    document.getElementById("moisture-val").innerText = currentMoisture;
    document.getElementById("market-val").innerText = `${currentMarket.crop} ${currentMarket.trend}`;
    document.getElementById("market-val").style.color = currentMarket.color;
}

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();

    const recommendBtn = document.getElementById('btn-recommend');
    if(recommendBtn) {
        recommendBtn.addEventListener('click', () => {
            window.location.href = "recommendation.html";
        });
    }
});