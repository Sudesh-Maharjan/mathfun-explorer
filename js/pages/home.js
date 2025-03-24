
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
                  <div class="glass-card">
                    <div class="card-header">
                      <h2 class="card-title">Login Options</h2>
                    </div>
                    <div class="card-content">
                      <div class="login-options">
                        <button id="teacher-login-btn" class="btn btn-outline mb-2 w-full">
                          <i class="fas fa-chalkboard-teacher"></i> Login as Teacher
                        </button>
                        <button id="student-login-btn" class="btn btn-primary mb-2 w-full">
                          <i class="fas fa-user-graduate"></i> Login as Student
                        </button>
                      </div>
                      
                      <div id="student-form-container" style="display: none;">
                        <form id="student-form" class="student-form">
                          <div class="form-group">
                            <label for="student-name">Full Name</label>
                            <input 
                              type="text" 
                              id="student-name" 
                              placeholder="Enter your full name" 
                              class="input" 
                              required
                            />
                          </div>
                          <div class="form-group">
                            <label for="student-roll">Roll Number</label>
                            <input 
                              type="text" 
                              id="student-roll" 
                              placeholder="Enter your roll number" 
                              class="input" 
                              required
                            />
                          </div>
                          <div class="form-group">
                            <label for="student-class">Class</label>
                            <input 
                              type="text" 
                              id="student-class" 
                              placeholder="Enter your class" 
                              class="input" 
                              required
                            />
                          </div>
                          <button type="submit" class="btn btn-primary w-full">
                            <i class="fas fa-play"></i> Start Quiz
                          </button>
                        </form>
                      </div>
                      
                      <div id="teacher-login-container" style="display: none;">
                        <form id="teacher-login-form">
                          <div class="form-group">
                            <label for="teacher-username">Username</label>
                            <input 
                              type="text" 
                              id="teacher-username" 
                              placeholder="Enter admin username" 
                              class="input" 
                              required
                            />
                          </div>
                          <div class="form-group">
                            <label for="teacher-password">Password</label>
                            <input 
                              type="password" 
                              id="teacher-password" 
                              placeholder="Enter admin password" 
                              class="input" 
                              required
                            />
                          </div>
                          <button type="submit" class="btn btn-primary w-full">
                            <i class="fas fa-sign-in-alt"></i> Login
                          </button>
                        </form>
                      </div>
                    </div>
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
    
    // Add event listeners for login options
    const teacherLoginBtn = document.getElementById('teacher-login-btn');
    const studentLoginBtn = document.getElementById('student-login-btn');
    const studentFormContainer = document.getElementById('student-form-container');
    const teacherLoginContainer = document.getElementById('teacher-login-container');
    
    if (teacherLoginBtn) {
      teacherLoginBtn.addEventListener('click', () => {
        studentFormContainer.style.display = 'none';
        teacherLoginContainer.style.display = 'block';
      });
    }
    
    if (studentLoginBtn) {
      studentLoginBtn.addEventListener('click', () => {
        teacherLoginContainer.style.display = 'none';
        studentFormContainer.style.display = 'block';
      });
    }
    
    // Add event listener for student form
    const studentForm = document.getElementById('student-form');
    if (studentForm) {
      studentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const studentName = document.getElementById('student-name').value.trim();
        const studentRoll = document.getElementById('student-roll').value.trim();
        const studentClass = document.getElementById('student-class').value.trim();
        
        if (studentName && studentRoll && studentClass) {
          State.saveStudent(studentName, studentRoll, studentClass);
          Router.navigate('/quiz');
        }
      });
    }
    
    // Add event listener for teacher login form
    const teacherLoginForm = document.getElementById('teacher-login-form');
    if (teacherLoginForm) {
      teacherLoginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const username = document.getElementById('teacher-username').value.trim();
        const password = document.getElementById('teacher-password').value.trim();
        
        // Simple admin authentication (this would normally be server-side)
        if (username === 'admin' && password === 'admin123') {
          State.toggleAdmin();
          Router.navigate('/admin');
          Toast.success('Success', 'Logged in as admin successfully');
        } else {
          Toast.error('Authentication Error', 'Invalid username or password');
        }
      });
    }
  };
  
  // Public API
  return {
    render
  };
})();
