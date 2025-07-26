document.addEventListener("DOMContentLoaded", async () => {
  const map = new atlas.Map("map", {
    center: [117.0, -2.5], // Default Indonesia
    zoom: 5,
    view: "Auto",
    authOptions: {
      authType: "subscriptionKey",
      subscriptionKey: azureMapsKey, // variabel ini akan di-passing dari backend
    },
  });

  map.events.add("ready", async () => {
    // Ambil data proyek dari backend
    const response = await fetch("/map/data");
    const data = await response.json();

    // Tambahkan layer pin proyek
    const pins = data.map((proj) => {
      const pin = new atlas.HtmlMarker({
        position: [proj.longitude, proj.latitude],
        htmlContent: `<div class="custom-pin" title="${proj.title}"></div>`,
      });

      map.markers.add(pin);

      // Tambah event popup
      map.events.add("click", pin, () => {
        const popup = new atlas.Popup({
          content: `
            <div class="popup-content">
              <h4>${proj.title}</h4>
              <p><strong>Kategori:</strong> ${proj.category}</p>
              <p><strong>Deadline:</strong> ${new Date(proj.deadline).toLocaleDateString()}</p>
              <a href="/donasi/${proj.id}" class="btn btn-small">Donasi Sekarang</a>
            </div>`,
          position: [proj.longitude, proj.latitude],
        });
        popup.open(map);
      });

      return pin;
    });
  });
});
