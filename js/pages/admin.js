
// Admin page
const AdminPage = (function() {
  // Render the admin page
  const render = (container) => {
    // Get state
    const isAdmin = State.getIsAdmin();
    const students = State.getStudents();
    const customQuestions = State.getCustomQuestions();
    
    // If not admin, show access denied
    if (!isAdmin) {
      container.innerHTML = `
        <div class="container">
          <div class="access-denied">
            <div class="glass-card">
              <div class="card-header">
                <h2 class="card-title text-center">Access Restricted</h2>
                <p class="text-center">You need admin access to view this page.</p>
              </div>
              <div class="card-content text-center">
                <i class="fas fa-cog access-denied-icon"></i>
                <p>Please enable admin mode from the header to access the admin panel.</p>
              </div>
            </div>
          </div>
        </div>
      `;
      return;
    }
    
    // Create tabs content
    const adminPageContent = `
      <div class="container admin-container">
        <h1>Admin Panel</h1>
        
        <div class="tabs">
          <div class="tab-list">
            <button class="tab-button active" data-tab="questions">
              <i class="fas fa-cog"></i>
              Manage Questions
            </button>
            <button class="tab-button" data-tab="students">
              <i class="fas fa-users"></i>
              Student Data
            </button>
          </div>
          
          <div class="tab-content">
            <div class="tab-pane active" id="questions-tab">
              <!-- Question management form -->
              <div class="glass-card">
                <div class="card-header">
                  <h2 class="card-title">
                    <i class="fas fa-plus"></i>
                    <span id="form-title">Add Custom Question</span>
                  </h2>
                </div>
                <div class="card-content">
                  <form id="question-form" class="question-form">
                    <div class="form-grid">
                      <div class="form-group">
                        <label for="operation-select">Operation</label>
                        <select id="operation-select" class="select" required>
                          <option value="addition">Addition</option>
                          <option value="subtraction">Subtraction</option>
                          <option value="multiplication">Multiplication</option>
                          <option value="division">Division</option>
                        </select>
                      </div>
                      
                      <div class="form-group">
                        <label for="difficulty-select">Difficulty</label>
                        <select id="difficulty-select" class="select" required>
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                    </div>
                    
                    <div class="form-group">
                      <label for="question-input">Question</label>
                      <input 
                        type="text" 
                        id="question-input" 
                        class="input" 
                        placeholder="e.g. 5 + 3 = ?" 
                        required
                      />
                    </div>
                    
                    <div class="form-group">
                      <label for="answer-input">Correct Answer</label>
                      <input 
                        type="number" 
                        id="answer-input" 
                        class="input" 
                        placeholder="e.g. 8" 
                        required
                      />
                    </div>
                    
                    <div class="form-group">
                      <label>Wrong Options (at least one)</label>
                      <div class="options-grid">
                        <input 
                          type="number" 
                          id="option1-input" 
                          class="input" 
                          placeholder="Option 1"
                        />
                        <input 
                          type="number" 
                          id="option2-input" 
                          class="input" 
                          placeholder="Option 2"
                        />
                        <input 
                          type="number" 
                          id="option3-input" 
                          class="input" 
                          placeholder="Option 3"
                        />
                      </div>
                    </div>
                    
                    <div class="form-actions">
                      <button type="button" id="cancel-button" class="btn btn-outline" style="display: none;">
                        Cancel
                      </button>
                      <button type="submit" id="submit-button" class="btn btn-primary">
                        <i class="fas fa-plus"></i>
                        Add Question
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              
              <!-- Custom questions list -->
              <div class="glass-card">
                <div class="card-header">
                  <h2 class="card-title">Custom Questions (${customQuestions.length})</h2>
                </div>
                <div class="card-content">
                  <div id="questions-list" class="questions-list">
                    <!-- Custom questions will be rendered here -->
                  </div>
                </div>
              </div>
            </div>
            
            <div class="tab-pane" id="students-tab">
              <!-- Students data table -->
              <div class="glass-card">
                <div class="card-header">
                  <h2 class="card-title">Student Data</h2>
                  <p class="card-description">
                    View performance data for all students.
                  </p>
                </div>
                <div class="card-content">
                  <div class="students-table-container">
                    <table class="students-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Score</th>
                          <th>Questions Attempted</th>
                          <th>Correct Answers</th>
                          <th>Accuracy</th>
                        </tr>
                      </thead>
                      <tbody id="students-table-body">
                        <!-- Student data will be rendered here -->
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Update the container
    container.innerHTML = adminPageContent;
    
    // Render custom questions
    renderCustomQuestions();
    
    // Render student data
    renderStudentData();
    
    // Add event listeners for tabs
    const tabButtons = container.querySelectorAll('.tab-button');
    const tabPanes = container.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        
        // Deactivate all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Activate selected tab
        button.classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
      });
    });
    
    // Add event listener for question form
    const questionForm = document.getElementById('question-form');
    const cancelButton = document.getElementById('cancel-button');
    
    let editingId = null;
    
    if (questionForm) {
      questionForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Get form values
        const operation = document.getElementById('operation-select').value;
        const difficulty = document.getElementById('difficulty-select').value;
        const question = document.getElementById('question-input').value.trim();
        const answer = parseInt(document.getElementById('answer-input').value.trim(), 10);
        
        // Get option values
        const options = [
          document.getElementById('option1-input').value.trim(),
          document.getElementById('option2-input').value.trim(),
          document.getElementById('option3-input').value.trim()
        ]
        .filter(opt => opt && !isNaN(parseInt(opt, 10)))
        .map(opt => parseInt(opt, 10));
        
        // Validation
        if (!question) {
          Toast.error('Error', 'Please enter a question');
          return;
        }
        
        if (isNaN(answer)) {
          Toast.error('Error', 'Please enter a valid numeric answer');
          return;
        }
        
        if (options.length < 1) {
          Toast.error('Error', 'Please provide at least one option besides the correct answer');
          return;
        }
        
        // Combine options with answer
        const allOptions = [...options, answer];
        
        // Create question object
        const questionObj = {
          question,
          answer,
          options: allOptions,
          operation,
          difficulty
        };
        
        if (editingId) {
          // Update existing question
          State.removeCustomQuestion(editingId);
          State.addCustomQuestion(questionObj);
          
          Toast.success('Success', 'Question updated successfully');
          
          // Reset editing state
          editingId = null;
          document.getElementById('form-title').innerText = 'Add Custom Question';
          document.getElementById('submit-button').innerHTML = '<i class="fas fa-plus"></i> Add Question';
          cancelButton.style.display = 'none';
        } else {
          // Add new question
          State.addCustomQuestion(questionObj);
          
          Toast.success('Success', 'New question added successfully');
        }
        
        // Reset form
        questionForm.reset();
        document.getElementById('option1-input').value = '';
        document.getElementById('option2-input').value = '';
        document.getElementById('option3-input').value = '';
      });
    }
    
    if (cancelButton) {
      cancelButton.addEventListener('click', () => {
        // Reset editing state
        editingId = null;
        document.getElementById('form-title').innerText = 'Add Custom Question';
        document.getElementById('submit-button').innerHTML = '<i class="fas fa-plus"></i> Add Question';
        cancelButton.style.display = 'none';
        
        // Reset form
        document.getElementById('question-form').reset();
        document.getElementById('option1-input').value = '';
        document.getElementById('option2-input').value = '';
        document.getElementById('option3-input').value = '';
      });
    }
    
    // Function to edit a question
    window.editQuestion = (id) => {
      const question = customQuestions.find(q => q.id === id);
      if (!question) return;
      
      // Set form values
      document.getElementById('operation-select').value = question.operation;
      document.getElementById('difficulty-select').value = question.difficulty;
      document.getElementById('question-input').value = question.question;
      document.getElementById('answer-input').value = question.answer;
      
      // Set options (excluding the correct answer)
      const otherOptions = question.options
        .filter(opt => opt !== question.answer)
        .map(opt => opt.toString());
      
      document.getElementById('option1-input').value = otherOptions[0] || '';
      document.getElementById('option2-input').value = otherOptions[1] || '';
      document.getElementById('option3-input').value = otherOptions[2] || '';
      
      // Update form state
      editingId = id;
      document.getElementById('form-title').innerText = 'Edit Question';
      document.getElementById('submit-button').innerHTML = '<i class="fas fa-save"></i> Update Question';
      document.getElementById('cancel-button').style.display = 'inline-block';
      
      // Scroll to form
      document.getElementById('question-form').scrollIntoView({ behavior: 'smooth' });
    };
    
    // Function to delete a question
    window.deleteQuestion = (id) => {
      if (confirm('Are you sure you want to delete this question?')) {
        State.removeCustomQuestion(id);
        Toast.success('Success', 'Question removed successfully');
      }
    };
  };
  
  // Render custom questions
  const renderCustomQuestions = () => {
    const container = document.getElementById('questions-list');
    if (!container) return;
    
    const customQuestions = State.getCustomQuestions();
    
    if (customQuestions.length === 0) {
      container.innerHTML = `
        <p class="empty-state">
          No custom questions yet. Add one above to get started.
        </p>
      `;
      return;
    }
    
    let questionsHTML = '';
    
    customQuestions.forEach(question => {
      questionsHTML += `
        <div class="question-item">
          <div class="question-content">
            <div class="question-text">${question.question}</div>
            <div class="question-meta">
              Answer: ${question.answer} | 
              ${question.operation.charAt(0).toUpperCase() + question.operation.slice(1)} |
              ${question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </div>
          </div>
          <div class="question-actions">
            <button class="btn btn-icon" onclick="editQuestion('${question.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-icon delete" onclick="deleteQuestion('${question.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = questionsHTML;
  };
  
  // Render student data
  const renderStudentData = () => {
    const container = document.getElementById('students-table-body');
    if (!container) return;
    
    const students = State.getStudents();
    
    if (students.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="5" class="empty-state">
            No student data available
          </td>
        </tr>
      `;
      return;
    }
    
    let studentRows = '';
    
    students.forEach(student => {
      const accuracy = student.totalQuestions > 0 
        ? Math.round((student.correctAnswers / student.totalQuestions) * 100) 
        : 0;
        
      studentRows += `
        <tr>
          <td>${student.name}</td>
          <td>${student.score}</td>
          <td>${student.totalQuestions}</td>
          <td>${student.correctAnswers}</td>
          <td>${accuracy}%</td>
        </tr>
      `;
    });
    
    container.innerHTML = studentRows;
  };
  
  // Listen for state changes
  State.on('customQuestionsChanged', renderCustomQuestions);
  State.on('studentUpdated', renderStudentData);
  
  // Public API
  return {
    render
  };
})();
