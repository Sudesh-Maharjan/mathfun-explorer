
// Leaderboard component
const LeaderboardComponent = (function() {
  // Render the leaderboard
  const render = (container, students, limit = 5, showTitle = true) => {
    // Sort students by score and take the top ones
    const topStudents = [...students]
      .sort((a, b) => {
        // Primary sort by score
        if (b.score !== a.score) return b.score - a.score;
        
        // Secondary sort by accuracy
        const aAccuracy = a.totalQuestions > 0 ? a.correctAnswers / a.totalQuestions : 0;
        const bAccuracy = b.totalQuestions > 0 ? b.correctAnswers / b.totalQuestions : 0;
        return bAccuracy - aAccuracy;
      })
      .slice(0, limit);
    
    // Create leaderboard content
    let leaderboardContent = `
      <div class="glass-card">
        <div class="card-header">
          ${showTitle ? '<h2 class="card-title">Leaderboard</h2>' : ''}
        </div>
        <div class="card-content">
    `;
    
    // No students yet
    if (topStudents.length === 0) {
      leaderboardContent += `
        <p class="empty-state">
          No students have played yet. Be the first!
        </p>
      `;
    } else {
      leaderboardContent += `<div class="leaderboard-list">`;
      
      // Render each student
      topStudents.forEach((student, index) => {
        // Calculate accuracy percentage
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
        
        // Determine rank class
        const rankClass = index === 0 ? 'gold' : 
                          index === 1 ? 'silver' : 
                          index === 2 ? 'bronze' : '';
        
        leaderboardContent += `
          <div class="leaderboard-item ${rankClass}">
            <div class="student-info">
              <div class="rank">${rankIcon}</div>
              <div>
                <div class="student-name">${student.name}</div>
                <div class="student-details">
                  ${student.roll ? `Roll: ${student.roll}` : ''} 
                  ${student.class ? `Class: ${student.class}` : ''}
                </div>
              </div>
            </div>
            <div class="student-stats">
              <div class="accuracy">${accuracy}% accuracy</div>
              <div class="score">${student.score}</div>
            </div>
          </div>
        `;
      });
      
      leaderboardContent += `</div>`;
    }
    
    leaderboardContent += `
        </div>
      </div>
    `;
    
    // Update the container
    container.innerHTML = leaderboardContent;
  };
  
  // Public API
  return {
    render
  };
})();
