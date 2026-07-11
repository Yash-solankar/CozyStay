document.addEventListener("DOMContentLoaded", () => {
    const mapDiv = document.getElementById("map");

    if (!mapDiv) return;

    const lat = Number(mapDiv.dataset.lat);
    const lng = Number(mapDiv.dataset.lng);

    const map = L.map("map").setView([lat, lng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<b>${mapDiv.dataset.title}</b>`)
        .openPopup();
});