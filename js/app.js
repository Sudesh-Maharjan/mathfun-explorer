
// Main application entry point
document.addEventListener('DOMContentLoaded', () => {
  // Initialize state
  State.init();
  
  // Render header
  Header.render();
  
  // Initialize router
  Router.init();
});
