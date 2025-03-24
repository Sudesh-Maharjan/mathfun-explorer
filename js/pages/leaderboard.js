
// Leaderboard page
const LeaderboardPage = (function() {
  // Render the leaderboard page
  const render = (container) => {
    // Get students
    const students = State.getStudents();
    
    // Create leaderboard page content
    const leaderboardPageContent = `
      <div class="container leaderboard-container">
        <div class="page-header">
          <h1>Leaderboard</h1>
          
          <div class="search-container">
            <i class="fas fa-search search-icon"></i>
            <input 
              type="text" 
              id="student-search" 
              placeholder="Search students..." 
              class="input search-input"
            />
            <button id="clear-search" class="clear-search-btn" style="display: none;">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <div class="glass-card">
          <div class="card-header">
            <h2 class="card-title">Student Rankings</h2>
          </div>
          <div class="card-content">
            <div id="leaderboard-table-container" class="leaderboard-table-container">
              <!-- Leaderboard table will be rendered here -->
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Update the container
    container.innerHTML = leaderboardPageContent;
    
    // Render leaderboard table
    renderLeaderboardTable(students);
    
    // Add event listener for search
    const searchInput = document.getElementById('student-search');
    const clearSearchButton = document.getElementById('clear-search');
    
    if (searchInput) {
      searchInput.addEventListener('input', (event) => {
        const searchValue = event.target.value.trim().toLowerCase();
        
        // Show/hide clear button
        if (clearSearchButton) {
          clearSearchButton.style.display = searchValue ? 'block' : 'none';
        }
        
        // Filter students
        const filteredStudents = students.filter(student => 
          student.name.toLowerCase().includes(searchValue)
        );
        
        // Re-render table
        renderLeaderboardTable(filteredStudents);
      });
    }
    
    if (clearSearchButton) {
      clearSearchButton.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
          
          // Hide clear button
          clearSearchButton.style.display = 'none';
          
          // Re-render table with all students
          renderLeaderboardTable(students);
        }
      });
    }
  };
  
  // Render leaderboard table
  const renderLeaderboardTable = (students) => {
    const container = document.getElementById('leaderboard-table-container');
    if (!container) return;
    
    // Sort students by score
    const sortedStudents = [...students].sort((a, b) => {
      // Primary sort by score
      if (b.score !== a.score) return b.score - a.score;
      
      // Secondary sort by accuracy
      const aAccuracy = a.totalQuestions > 0 ? a.correctAnswers / a.totalQuestions : 0;
      const bAccuracy = b.totalQuestions > 0 ? b.correctAnswers / b.totalQuestions : 0;
      return bAccuracy - aAccuracy;
    });
    
    // No students
    if (sortedStudents.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>No students found</h3>
          <p>
            ${students.length === 0 
              ? "No students have played the game yet." 
              : "No students match your search criteria."}
          </p>
        </div>
      `;
      return;
    }
    
    // Create table
    let tableContent = `
      <div class="leaderboard-table">
        <div class="table-header">
          <div class="col-rank">Rank</div>
          <div class="col-name">Name</div>
          <div class="col-questions">Questions</div>
          <div class="col-accuracy">Accuracy</div>
          <div class="col-score">Score</div>
        </div>
        <div class="table-body">
    `;
    
    // Add table rows
    sortedStudents.forEach((student, index) => {
      // Calculate accuracy
      const accuracy = student.totalQuestions > 0 
        ? Math.round((student.correctAnswers / student.totalQuestions) * 100) 
        : 0;
      
      // Determine rank icon
      let rankIcon;
      switch (index) {
        case 0:
          rankIcon = '<i class="fas fa-trophy rank-gold"></i>';
          break;
        case 1:
          rankIcon = '<i class="fas fa-medal rank-silver"></i>';
          break;
        case 2:
          rankIcon = '<i class="fas fa-award rank-bronze"></i>';
          break;
        default:
          rankIcon = `<span class="rank-number">${index + 1}</span>`;
      }
      
      // Determine row class
      const rowClass = index === 0 ? 'gold' : 
                        index === 1 ? 'silver' : 
                        index === 2 ? 'bronze' : '';
      
      tableContent += `
        <div class="table-row ${rowClass}">
          <div class="col-rank">${rankIcon}</div>
          <div class="col-name">${student.name}</div>
          <div class="col-questions">${student.totalQuestions}</div>
          <div class="col-accuracy">${accuracy}%</div>
          <div class="col-score">${student.score}</div>
        </div>
      `;
    });
    
    tableContent += `
        </div>
      </div>
    `;
    
    // Update container
    container.innerHTML = tableContent;
  };
  
  // Public API
  return {
    render
  };
})();
