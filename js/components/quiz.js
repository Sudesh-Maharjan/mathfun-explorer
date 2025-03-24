
// Quiz component
const QuizComponent = (function() {
  // Private variables
  let selectedAnswer = null;
  
  // Render the quiz card
  const render = (container, question, onAnswerSelected, onNextQuestion) => {
    if (!question) return;
    
    // Get operation details
    const getOperationColor = () => {
      switch (question.operation) {
        case 'addition': return 'blue';
        case 'subtraction': return 'red';
        case 'multiplication': return 'green';
        case 'division': return 'purple';
        default: return 'gray';
      }
    };
    
    // Create quiz card content
    const quizCardContent = `
      <div class="glass-card quiz-card">
        <div class="card-header">
          <div class="quiz-meta">
            <div class="operation-badge ${getOperationColor()}">
              ${question.operation.charAt(0).toUpperCase() + question.operation.slice(1)}
            </div>
            <div class="difficulty-badge">
              ${question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </div>
          </div>
          <h2 class="question">${question.question}</h2>
        </div>
        <div class="card-content">
          <div class="options-grid">
            ${question.options.map((option) => `
              <button class="option-button" data-value="${option}">
                ${option}
              </button>
            `).join('')}
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary next-question" style="display: none;">
            Next Question
          </button>
        </div>
      </div>
    `;
    
    // Update the container
    container.innerHTML = quizCardContent;
    
    // Reset selected answer
    selectedAnswer = null;
    
    // Add event listeners for options
    const optionButtons = container.querySelectorAll('.option-button');
    const nextButton = container.querySelector('.next-question');
    
    optionButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (selectedAnswer !== null) return; // Prevent multiple selections
        
        const value = parseInt(button.getAttribute('data-value'), 10);
        selectedAnswer = value;
        
        // Check if the answer is correct
        const isCorrect = value === question.answer;
        
        // Update button style
        button.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        // If incorrect, highlight the correct answer
        if (!isCorrect) {
          optionButtons.forEach(btn => {
            if (parseInt(btn.getAttribute('data-value'), 10) === question.answer) {
              btn.classList.add('correct-highlight');
            }
          });
        }
        
        // Show feedback
        if (isCorrect) {
          Toast.success('Correct!', 'Great job! You got it right.');
        } else {
          Toast.error('Not quite right', `The correct answer was ${question.answer}`);
        }
        
        // Disable all buttons
        optionButtons.forEach(btn => {
          btn.disabled = true;
        });
        
        // Show next button
        nextButton.style.display = 'block';
        
        // Call parent handler
        onAnswerSelected(value);
        
        // Auto-advance after a delay
        setTimeout(() => {
          onNextQuestion();
        }, 2000);
      });
    });
    
    // Add event listener for next button
    nextButton.addEventListener('click', onNextQuestion);
  };
  
  // Public API
  return {
    render
  };
})();
