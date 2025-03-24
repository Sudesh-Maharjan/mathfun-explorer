
// Home page
const HomePage = (function() {
  // Render the home page
  const render = (container) => {
    // Get students for leaderboard
    const students = State.getStudents();
    
    // Create operation icons
    const operationIcons = [
      { icon: 'fa-plus', color: 'blue', name: 'Addition' },
      { icon: 'fa-minus', color: 'red', name: 'Subtraction' },
      { icon: 'fa-times', color: 'green', name: 'Multiplication' },
      { icon: 'fa-divide', color: 'purple', name: 'Division' }
    ];
    
    // Create home page content
    const homeContent = `
      <div class="container home-container">
        <div class="grid-container">
          <!-- Hero Section -->
          <div class="hero-section">
            <div class="glass-card">
              <div class="hero-content">
                <h1>Math<span>Quest</span></h1>
                <p class="hero-description">
                  An engaging math adventure for 4th graders. Practice addition, subtraction, 
                  multiplication, and division while tracking your progress!
                </p>
                
                <div class="action-buttons">
                  <form id="student-form" class="student-form">
                    <input 
                      type="text" 
                      id="student-name" 
                      placeholder="Enter your name" 
                      class="input" 
                      required
                    />
                    <button type="submit" class="btn btn-primary">Start</button>
                  </form>
                  
                  <a href="/quiz" class="btn btn-outline">
                    <i class="fas fa-calculator"></i>
                    Play as Guest
                  </a>
                </div>
                
                <h2 class="section-title">Practice your skills:</h2>
                
                <div class="operations-grid">
                  ${operationIcons.map((op) => `
                    <a href="/quiz?op=${op.name.toLowerCase()}" class="operation-card">
                      <div class="operation-icon ${op.color}">
                        <i class="fas ${op.icon}"></i>
                      </div>
                      <span>${op.name}</span>
                    </a>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Leaderboard -->
          <div class="leaderboard-section">
            <div id="home-leaderboard">
              <!-- Leaderboard will be rendered here -->
            </div>
            
            <div class="text-center">
              <a href="/leaderboard" class="btn btn-ghost btn-sm">
                <i class="fas fa-medal"></i>
                View Full Leaderboard
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Update the container
    container.innerHTML = homeContent;
    
    // Render leaderboard
    const leaderboardContainer = document.getElementById('home-leaderboard');
    if (leaderboardContainer) {
      LeaderboardComponent.render(leaderboardContainer, students, 5, true);
    }
    
    // Add event listener for student form
    const studentForm = document.getElementById('student-form');
    if (studentForm) {
      studentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const studentNameInput = document.getElementById('student-name');
        const studentName = studentNameInput.value.trim();
        
        if (studentName) {
          State.saveStudent(studentName);
          Router.navigate('/quiz');
        }
      });
    }
  };
  
  // Public API
  return {
    render
  };
})();
