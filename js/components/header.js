
// Header component
const Header = (function() {
  // Render the header
  const render = () => {
    const headerElement = document.getElementById('app-header');
    if (!headerElement) return;
    
    // Get state
    const isAdmin = State.getIsAdmin();
    const currentStudent = State.getCurrentStudent();
    
    // Create header content
    const headerContent = `
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <a href="/">
              <i class="fas fa-calculator"></i>
              <h1>Math<span>Quest</span></h1>
            </a>
          </div>
          
          <nav class="desktop-nav">
            <a href="/" class="nav-item">
              <i class="fas fa-home"></i>
              <span>Home</span>
            </a>
            <a href="/quiz" class="nav-item">
              <i class="fas fa-calculator"></i>
              <span>Play</span>
            </a>
            <a href="/leaderboard" class="nav-item">
              <i class="fas fa-medal"></i>
              <span>Leaderboard</span>
            </a>
            ${isAdmin ? `
              <a href="/admin" class="nav-item">
                <i class="fas fa-cog"></i>
                <span>Admin</span>
              </a>
            ` : ''}
          </nav>
          
          <div class="header-actions">
            ${currentStudent ? `
              <div class="student-info">
                <span class="label">Student:</span>
                <span class="name">${currentStudent.name}</span>
              </div>
            ` : ''}
            
            <button class="btn btn-outline btn-sm" id="admin-toggle">
              ${isAdmin ? 'Exit Admin' : 'Admin Mode'}
            </button>
          </div>
        </div>
        
        <div class="mobile-nav">
          <a href="/" class="nav-item">
            <i class="fas fa-home"></i>
            <span>Home</span>
          </a>
          <a href="/quiz" class="nav-item">
            <i class="fas fa-calculator"></i>
            <span>Play</span>
          </a>
          <a href="/leaderboard" class="nav-item">
            <i class="fas fa-medal"></i>
            <span>Scores</span>
          </a>
          ${isAdmin ? `
            <a href="/admin" class="nav-item">
              <i class="fas fa-cog"></i>
              <span>Admin</span>
            </a>
          ` : ''}
        </div>
      </div>
    `;
    
    // Update the header element
    headerElement.innerHTML = headerContent;
    
    // Add event listener for admin toggle
    const adminToggleButton = document.getElementById('admin-toggle');
    if (adminToggleButton) {
      adminToggleButton.addEventListener('click', () => {
        State.toggleAdmin();
      });
    }
  };
  
  // Listen for state changes
  State.on('adminChanged', render);
  State.on('currentStudentChanged', render);
  
  // Public API
  return {
    render
  };
})();
