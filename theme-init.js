// Runs in <head> before first paint so the saved theme never flashes.
(function () {
  var root = document.documentElement;
  var theme = null;
  try {
    theme = localStorage.getItem('theme');
  } catch (error) {
    // Storage unavailable (private mode, blocked cookies); fall back to the OS preference.
  }
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  root.setAttribute('data-theme', theme);
  root.classList.add('js');
})();
