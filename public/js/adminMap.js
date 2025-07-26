document.addEventListener("DOMContentLoaded", async () => {
  const map = new atlas.Map("map", {
    center: [117.0, -2.5],
    zoom: 5,
    view: "Auto",
    authOptions: {
      authType: "subscriptionKey",
      subscriptionKey: azureMapsKey, // dipassing dari backend
    },
  });

  const popupForm = document.getElementById("form-popup");
  const editForm = document.getElementById("editProjectForm");

  // Load proyek dari backend
  async function loadProjects() {
    const res = await fetch("/map/data");
    const data = await res.json();

    data.forEach((proj) => {
      const marker = new atlas.HtmlMarker({
        position: [proj.longitude, proj.latitude],
        htmlContent: `<div class="custom-pin-admin" title="${proj.title}"></div>`,
      });

      map.markers.add(marker);

      map.events.add("click", marker, () => {
        showEditForm(proj);
      });
    });
  }

  // Tampilkan form edit proyek
  function showEditForm(proj) {
    popupForm.classList.remove("hidden");
    document.getElementById("editId").value = proj.id;
    document.getElementById("editTitle").value = proj.title;
    document.getElementById("editDescription").value = proj.description;
    document.getElementById("editCategory").value = proj.category;
    document.getElementById("editDeadline").value = proj.deadline.split("T")[0];
    document.getElementById("editLatitude").value = proj.latitude;
    document.getElementById("editLongitude").value = proj.longitude;
  }

  // Submit form edit
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("editId").value;
    const data = {
      title: document.getElementById("editTitle").value,
      description: document.getElementById("editDescription").value,
      category: document.getElementById("editCategory").value,
      deadline: document.getElementById("editDeadline").value,
      latitude: document.getElementById("editLatitude").value,
      longitude: document.getElementById("editLongitude").value,
    };

    await fetch(`/admin/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    alert("Proyek berhasil diperbarui!");
    location.reload();
  });

  // Hapus proyek
  document.getElementById("deleteBtn").addEventListener("click", async () => {
    const id = document.getElementById("editId").value;
    if (confirm("Yakin ingin menghapus proyek ini?")) {
      await fetch(`/admin/projects/${id}`, { method: "DELETE" });
      alert("Proyek dihapus.");
      location.reload();
    }
  });

  map.events.add("ready", loadProjects);
});
