// Sample crop dataset + simple rule-based recommendation engine
const crops = [
  {name:'Wheat', idealPH:[6.0,7.5], soils:['Loamy','Clay'], rainfall:[300,900], temp:[10,25], waterNeed:1, price:200, demand:7},
  {name:'Rice', idealPH:[5.5,6.8], soils:['Clay','Loamy'], rainfall:[1000,2500], temp:[20,35], waterNeed:3, price:250, demand:9},
  {name:'Maize', idealPH:[5.5,7.0], soils:['Loamy','Sandy'], rainfall:[500,1200], temp:[18,30], waterNeed:2, price:180, demand:8},
  {name:'Soybean', idealPH:[6.0,7.0], soils:['Loamy'], rainfall:[400,1000], temp:[15,30], waterNeed:2, price:220, demand:6},
  {name:'Cotton', idealPH:[5.5,7.5], soils:['Sandy','Loamy'], rainfall:[400,800], temp:[20,35], waterNeed:2, price:240, demand:5},
  {name:'Potato', idealPH:[5.0,6.5], soils:['Loamy'], rainfall:[500,1200], temp:[15,22], waterNeed:2, price:210, demand:6},
  {name:'Tomato', idealPH:[5.5,7.0], soils:['Loamy'], rainfall:[400,900], temp:[18,30], waterNeed:2, price:300, demand:8},
];

function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

function scoreCrop(inputs, crop, marketWeight){
  // pH score
  const phMid = (crop.idealPH[0]+crop.idealPH[1])/2;
  const phRange = (crop.idealPH[1]-crop.idealPH[0])/2 + 0.1;
  const phScore = clamp(1 - Math.abs(inputs.ph - phMid)/phRange, 0, 1);

  // soil match
  const soilScore = crop.soils.includes(inputs.soil) ? 1 : 0;

  // rainfall score
  const rMin = crop.rainfall[0], rMax = crop.rainfall[1];
  let rainScore = 0;
  if(inputs.rainfall >= rMin && inputs.rainfall <= rMax) rainScore = 1;
  else {
    const d = Math.min(Math.abs(inputs.rainfall - rMin), Math.abs(inputs.rainfall - rMax));
    rainScore = clamp(1 - d/Math.max(rMin, rMax,1), 0, 1);
  }

  // temp score
  const tMin = crop.temp[0], tMax = crop.temp[1];
  let tempScore = 0;
  if(inputs.temp >= tMin && inputs.temp <= tMax) tempScore = 1;
  else {
    const d = Math.min(Math.abs(inputs.temp - tMin), Math.abs(inputs.temp - tMax));
    tempScore = clamp(1 - d/Math.max(Math.abs(tMin), Math.abs(tMax),1), 0, 1);
  }

  // irrigation / water penalty
  let waterPenalty = 0;
  if(inputs.irrigation === 'no' && crop.waterNeed >= 3) waterPenalty = 0.5;

  // market score (normalized price * demand)
  const maxPrice = Math.max(...crops.map(c=>c.price));
  const maxDemand = Math.max(...crops.map(c=>c.demand));
  const marketScore = ((crop.price/maxPrice) * (crop.demand/maxDemand));

  // weighted sum
  const envScore = (phScore*0.25 + soilScore*0.2 + rainScore*0.25 + tempScore*0.2);
  const final = clamp(envScore*(1 - waterPenalty) * (1 - 0.0) + marketWeight * marketScore*0.3, 0, 2);

  return {
    crop: crop.name,
    final: final,
    breakdown:{phScore, soilScore, rainScore, tempScore, waterPenalty, marketScore}
  };
}

function recommend(inputs){
  const marketWeight = parseFloat(inputs.marketWeight);
  const scored = crops.map(c => scoreCrop(inputs, c, marketWeight));
  scored.sort((a,b)=>b.final - a.final);
  return scored;
}

function renderResults(list){
  const results = document.getElementById('results');
  const chart = document.getElementById('chart');
  results.innerHTML = '';
  chart.innerHTML = '';

  const top = list.slice(0,5);
  const ol = document.createElement('ol');
  top.forEach(item=>{
    const li = document.createElement('li');
    li.innerHTML = `<strong>${item.crop}</strong> — score: ${item.final.toFixed(2)}<br>`+
      `<small>pH:${item.breakdown.phScore.toFixed(2)} soil:${item.breakdown.soilScore} rain:${item.breakdown.rainScore.toFixed(2)} temp:${item.breakdown.tempScore.toFixed(2)} market:${item.breakdown.marketScore.toFixed(2)}</small>`;
    ol.appendChild(li);
  });
  results.appendChild(ol);

  // Simple bar visualization
  const max = Math.max(...top.map(t=>t.final), 1);
  top.forEach(item=>{
    const row = document.createElement('div');
    row.className = 'bar-row';
    const label = document.createElement('div');
    label.className = 'bar-label';
    label.textContent = item.crop;
    const barWrap = document.createElement('div');
    barWrap.className = 'bar-wrap';
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.width = (item.final/max*100) + '%';
    bar.textContent = item.final.toFixed(2);
    barWrap.appendChild(bar);
    row.appendChild(label);
    row.appendChild(barWrap);
    chart.appendChild(row);
  });
}

document.getElementById('input-form').addEventListener('submit', e=>{
  e.preventDefault();
  const inputs = {
    ph: parseFloat(document.getElementById('soil-ph').value),
    soil: document.getElementById('soil-type').value,
    rainfall: parseFloat(document.getElementById('rainfall').value),
    temp: parseFloat(document.getElementById('temp').value),
    irrigation: document.getElementById('irrigation').value,
    marketWeight: document.getElementById('market-weight').value,
  };
  const rec = recommend(inputs);
  renderResults(rec);
});

document.getElementById('sample-btn').addEventListener('click', ()=>{
  document.getElementById('soil-ph').value = 6.2;
  document.getElementById('soil-type').value = 'Loamy';
  document.getElementById('rainfall').value = 900;
  document.getElementById('temp').value = 26;
  document.getElementById('irrigation').value = 'yes';
  document.getElementById('market-weight').value = 1.2;
});

// Auto-run sample on load for quick demo
window.addEventListener('load', ()=>{
  document.getElementById('sample-btn').click();
});
