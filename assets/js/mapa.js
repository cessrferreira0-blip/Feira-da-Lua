const map = L.map("map").setView([-23.3103, -51.1628], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

const feiraIcon = L.icon({
  iconUrl: "assets/img/icone_barraca.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

// Grupo de marcadores (para limpar depois)
let markersLayer = L.layerGroup().addTo(map);

// Carregar GeoJSON
let feiras = [];

const response=fetch("../data/feiras.json")
  .then((res) => res.json())
  .then((data) => {
    feiras = data.features;
    console.log(feiras)
    renderMarkers("all"); // mostrar tudo ao iniciar
  });

// Função para renderizar marcadores
function renderMarkers(day) {
  console.log(day)
  markersLayer.clearLayers();

  feiras
    .filter((f) => day === "all" || f.properties.dia === day)
    .forEach((f) => {
      const coords = f.geometry.coordinates;

      const props = f.properties;

      L.marker([coords[1], coords[0]], { icon: feiraIcon }).addTo(markersLayer)
        .bindPopup(`
          <b>${props.name}</b><br>
          <b>Dia:</b> ${props.dia}<br>
          <b>Horário:</b> ${props.horario}<br>
          <b>Local:</b> ${props.endereco}<br><br>
          <b>Bancas:</b><br>
          ${props.bancas.map((b) => `• ${b}`).join("<br>")}
        `);
    });
}

// Listener dos botões de filtro
document.querySelectorAll(".filter-days button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-days button")
      .forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");

    const day = btn.dataset.day;
    renderMarkers(day);
  });
});