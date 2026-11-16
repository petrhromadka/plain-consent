// Shows what the page can see: the accepted categories (plain-consent:update) and whether the tagged script ran.
const state = document.getElementById("state");
const probe = document.getElementById("probe");

const showProbe = () => {
  probe.textContent = window.demoAnalyticsRan ? "allowed, it ran" : "blocked, it has not run";
};

document.addEventListener("plain-consent:update", (event) => {
  state.textContent = event.detail.categories.join(", ");
  showProbe();
});
document.addEventListener("demo:analytics", showProbe);

for (const link of document.querySelectorAll("#langs a")) {
  if (link.getAttribute("hreflang") === document.documentElement.lang) link.setAttribute("aria-current", "true");
}
