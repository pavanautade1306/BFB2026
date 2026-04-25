document.addEventListener('DOMContentLoaded', () => {
    
    const zoneSelect = document.getElementById('zone-select');
    const rainSlider = document.getElementById('rain-deviation');
    const tableBody = document.getElementById('market-data');

    // Base Database of Commodities and their Water Sensitivity Multipliers
    const commodities = [
        { name: "Paddy (Rice)", basePrice: 2200, sensitivity: 1.5, type: "water-heavy" },
        { name: "Sugarcane", basePrice: 315, sensitivity: 1.2, type: "water-heavy" },
        { name: "Cotton", basePrice: 6000, sensitivity: 1.0, type: "moderate" },
        { name: "Wheat", basePrice: 2125, sensitivity: 0.8, type: "moderate" },
        { name: "Pearl Millet (Bajra)", basePrice: 2500, sensitivity: 0.3, type: "drought-resistant" }
    ];

    // Function to calculate market impact and update the UI
    function updateMarket() {
        const rainDeviation = parseInt(rainSlider.value); // -60 to +60
        tableBody.innerHTML = ""; // Clear table

        commodities.forEach(item => {
            // 1. Calculate Price Shift 
            // Formula: Negative rain (drought) drives prices up based on crop sensitivity.
            // Positive rain (good monsoon) drives prices slightly down (surplus).
            let priceShiftPercent = -(rainDeviation * item.sensitivity * 0.4); 
            
            // 2. Determine Supply Status
            let supplyText = "Stable";
            let supplyClass = "badge-info";
            if (priceShiftPercent > 10) {
                supplyText = "Deficit Expected";
                supplyClass = "badge-danger";
            } else if (priceShiftPercent < -5) {
                supplyText = "Surplus Expected";
                supplyClass = "badge-success";
            }

            // 3. Determine Government Policy Action
            let policy = "Monitor Market Demand";
            let policyClass = "badge-info";

            if (priceShiftPercent > 15) {
                policy = "CRITICAL: Release Buffer Stocks / Restrict Exports";
                policyClass = "badge-danger";
            } else if (priceShiftPercent > 8) {
                policy = "Issue Import Tenders";
                policyClass = "badge-warning";
            } else if (priceShiftPercent < -10) {
                policy = "Initiate MSP Procurement to Protect Farmers";
                policyClass = "badge-success";
            }

            // 4. Format the Price Shift text
            let shiftText = priceShiftPercent > 0 ? `+${priceShiftPercent.toFixed(1)}% ▲` : `${priceShiftPercent.toFixed(1)}% ▼`;
            let shiftColor = priceShiftPercent > 0 ? '#D32F2F' : '#2E7D32'; // Red if inflation, Green if cheaper
            if (priceShiftPercent === 0) { shiftText = "0.0% -"; shiftColor = "#555"; }

            // 5. Inject into the Table
            const row = `
                <tr>
                    <td style="font-weight: 600;">${item.name}</td>
                    <td><span class="badge ${supplyClass}">${supplyText}</span></td>
                    <td style="color: ${shiftColor}; font-weight: bold;">${shiftText}</td>
                    <td><span class="badge ${policyClass}">${policy}</span></td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    // Event Listeners to trigger the update when inputs change
    zoneSelect.addEventListener('change', updateMarket);
    rainSlider.addEventListener('input', updateMarket);

    // Initial load
    updateMarket();
});