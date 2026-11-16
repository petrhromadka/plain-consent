// Stands in for an analytics script. The banner only runs it after the analytics category is accepted.
window.demoAnalyticsRan = true;
document.dispatchEvent(new CustomEvent("demo:analytics"));
