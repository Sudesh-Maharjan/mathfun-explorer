
// Quiz page
const QuizPage = (function() {
  // Render the quiz page
  const render = (container, params = {}) => {
    // Get state
    const currentQuestion = State.getQuestion() || State.generateNewQuestion();
    const score = State.getScore();
    
    // Check for operation in params
    if (params.op) {
      State.setOperation(params.op);
    }
    
    // Create quiz page content
    const quizPageContent = `
      <div class="container quiz-container">
        <div class="quiz-header">
          <div class="quiz-settings">
            <div class="settings-group">
              <label for="difficulty-select">Difficulty:</label>
              <select id="difficulty-select" class="select">
                <option value="easy" ${State.getDifficulty() === 'easy' ? 'selected' : ''}>Easy</option>
                <option value="medium" ${State.getDifficulty() === 'medium' ? 'selected' : ''}>Medium</option>
                <option value="hard" ${State.getDifficulty() === 'hard' ? 'selected' : ''}>Hard</option>
              </select>
            </div>
            
            <div class="settings-group">
              <label for="operation-select">Operation:</label>
              <select id="operation-select" class="select">
                <option value="addition" ${State.getOperation() === 'addition' ? 'selected' : ''}>Addition</option>
                <option value="subtraction" ${State.getOperation() === 'subtraction' ? 'selected' : ''}>Subtraction</option>
                <option value="multiplication" ${State.getOperation() === 'multiplication' ? 'selected' : ''}>Multiplication</option>
                <option value="division" ${State.getOperation() === 'division' ? 'selected' : ''}>Division</option>
              </select>
            </div>
          </div>
          
          <div class="score-display">
            Score: <span id="score-value">${score}</span>
          </div>
        </div>
        
        <div id="quiz-card-container" class="quiz-card-container">
          <!-- Quiz card will be rendered here -->
        </div>
      </div>
    `;
    
    // Update the container
    container.innerHTML = quizPageContent;
    
    // Render quiz card
    const quizCardContainer = document.getElementById('quiz-card-container');
    if (quizCardContainer && currentQuestion) {
      QuizComponent.render(
        quizCardContainer, 
        currentQuestion,
        handleAnswerSelected,
        handleNextQuestion
      );
    }
    
    // Add event listeners for settings
    const difficultySelect = document.getElementById('difficulty-select');
    const operationSelect = document.getElementById('operation-select');
    
    if (difficultySelect) {
      difficultySelect.addEventListener('change', (event) => {
        State.setDifficulty(event.target.value);
      });
    }
    
    if (operationSelect) {
      operationSelect.addEventListener('change', (event) => {
        State.setOperation(event.target.value);
      });
    }
  };
  
  // Handle answer selection
  const handleAnswerSelected = (selectedAnswer) => {
    const isCorrect = State.checkAnswer(selectedAnswer);
    
    // Update score display
    const scoreValue = document.getElementById('score-value');
    if (scoreValue) {
      scoreValue.textContent = State.getScore();
    }
    
    return isCorrect;
  };
  
  // Handle next question
  const handleNextQuestion = () => {
    // Generate new question
    State.generateNewQuestion();
    
    // Re-render the quiz page
    const quizCardContainer = document.getElementById('quiz-card-container');
    if (quizCardContainer) {
      QuizComponent.render(
        quizCardContainer, 
        State.getQuestion(),
        handleAnswerSelected,
        handleNextQuestion
      );
    }
  };
  
  // Listen for state changes
  State.on('questionChanged', () => {
    const quizCardContainer = document.getElementById('quiz-card-container');
    if (quizCardContainer) {
      QuizComponent.render(
        quizCardContainer, 
        State.getQuestion(),
        handleAnswerSelected,
        handleNextQuestion
      );
    }
  });
  
  State.on('scoreChanged', (score) => {
    const scoreValue = document.getElementById('score-value');
    if (scoreValue) {
      scoreValue.textContent = score;
    }
  });
  
  // Public API
  return {
    render
  };
})();
