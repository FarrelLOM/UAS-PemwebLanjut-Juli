document.addEventListener("DOMContentLoaded", () => {
  // Toggle navbar di mobile
  const toggleBtn = document.getElementById("navbar-toggle");
  const navLinks = document.getElementById("navbar-links");

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Auto hide alerts (jika ada)
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((el) => {
    setTimeout(() => {
      el.style.display = "none";
    }, 4000);
  });
});
