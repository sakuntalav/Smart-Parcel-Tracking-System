let map;

const mockData = {
    id: "IND-8829-DEL",
    prediction: {
        delayHours: 5,
        reason: "Heavy Monsoon Rain & Traffic",
        eta: "Dec 22, 2025",
        confidence: "94%"
    },
    locationName: "Hyderabad, Telangana",
    weather: "Heavy Rain (24°C)",
    route: {
        origin: [13.0827, 80.2707],     // Chennai
        current: [17.3850, 78.4867],    // Hyderabad
        destination: [19.0760, 72.8777] // Mumbai
    },
    history: [
        { status: "Package Picked Up", loc: "Chennai, TN", time: "Dec 18, 09:00 AM", done: true },
        { status: "In Transit - Hub Transfer", loc: "Bengaluru, KA", time: "Dec 19, 02:30 PM", done: true },
        { status: "Arrived at Sorting Facility", loc: "Hyderabad, TS", time: "Dec 19, 11:45 PM", done: true },
        { status: "Out for Delivery", loc: "Mumbai, MH", time: "Pending", done: false }
    ]
};

function initMap(coords) {
    if (map) { map.remove(); }
    
    map = L.map('map').setView(coords.current, 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);
    
    L.marker(coords.origin).addTo(map).bindPopup("Origin: Chennai");
    L.marker(coords.destination).addTo(map).bindPopup("Destination: Mumbai");
    
    L.circleMarker(coords.current, {
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 1,
        radius: 8
    }).addTo(map).bindPopup("Current Hub: Hyderabad").openPopup();
    
    const path = L.polyline([coords.origin, [12.9716, 77.5946], coords.current, coords.destination], {
        color: '#6366f1',
        weight: 4,
        dashArray: '5, 10',
        opacity: 0.7
    }).addTo(map);
}

function handleTrack() {
    const input = document.getElementById('trackingInput').value;
    if (!input) return alert("Please enter a tracking ID");

    document.getElementById('resultSection').classList.remove('hidden');

    // Fixed template literal and class assignment
    const alertCard = document.getElementById('alertCard');
    const alertMsg = document.getElementById('alertMessage');
    
    if (mockData.prediction.delayHours > 0) {
        alertCard.className = "p-6 rounded-2xl border-l-8 bg-amber-50 border-amber-500 shadow-sm";
        alertMsg.innerHTML = `<strong>Delay Prediction:</strong> Expect a ${mockData.prediction.delayHours}-hour delay reaching Mumbai due to ${mockData.prediction.reason}.`;
        document.getElementById('alertIcon').innerText = "⚠️";
    }

    document.getElementById('etaDate').innerText = mockData.prediction.eta;
    document.getElementById('currLoc').innerText = mockData.locationName;
    document.getElementById('weatherStatus').innerText = mockData.weather;

    // Render Timeline
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '<div class="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100"></div>';

    mockData.history.forEach(step => {
        const stepDiv = document.createElement('div');
        stepDiv.className = "relative flex gap-6 items-start";
        stepDiv.innerHTML = `
            <div class="timeline-dot ${step.done ? 'bg-indigo-600' : 'bg-slate-300'}"></div>
            <div>
                <p class="font-bold ${step.done ? 'text-slate-900' : 'text-slate-400'}">${step.status}</p>
                <p class="text-sm text-slate-500">${step.loc} • ${step.time}</p>
            </div>
        `;
        timeline.appendChild(stepDiv);
    });

    setTimeout(() => {
        initMap(mockData.route);
    }, 200);
}
