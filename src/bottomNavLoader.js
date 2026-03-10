document.addEventListener("DOMContentLoaded", async () => {
  const mount = document.getElementById("bottom-nav");
  if (!mount) return;

  try {
    const res = await fetch("./components/bottomNav.html");
    const html = await res.text();
    mount.innerHTML = html;

    document.getElementById("nav-stats")?.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "stats.html";
    });

    document.getElementById("nav-home")?.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "mainLandingPage.html";
    });

    document.getElementById("nav-highlights")?.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "highlights.html";
    });

    document.getElementById("nav-leaderboard")?.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "leaderboard.html";
    });

  } catch (err) {
    console.error("Nav load failed:", err);
  }
});