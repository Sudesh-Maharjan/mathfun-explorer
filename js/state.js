
// Global state management
const State = (function() {
  // Private state
  let currentQuestion = null;
  let score = 0;
  let difficulty = 'easy';
  let operation = 'addition';
  let students = [];
  let isAdmin = false;
  let customQuestions = [];
  let questionHistory = [];
  let currentStudent = null;
  
  // Load data from localStorage
  const loadData = () => {
    const savedStudents = localStorage.getItem('mathQuizStudents');
    if (savedStudents) {
      students = JSON.parse(savedStudents);
    }

    const savedCustomQuestions = localStorage.getItem('mathQuizCustomQuestions');
    if (savedCustomQuestions) {
      customQuestions = JSON.parse(savedCustomQuestions);
    }
  };

  // Save data to localStorage
  const saveStudents = () => {
    localStorage.setItem('mathQuizStudents', JSON.stringify(students));
  };

  const saveCustomQuestions = () => {
    localStorage.setItem('mathQuizCustomQuestions', JSON.stringify(customQuestions));
  };

  // Event system
  const events = {};
  
  const subscribe = (event, callback) => {
    if (!events[event]) {
      events[event] = [];
    }
    events[event].push(callback);
  };
  
  const publish = (event, data) => {
    if (!events[event]) return;
    events[event].forEach(callback => callback(data));
  };

  // Generate a new question
  const generateNewQuestion = () => {
    // Filter custom questions for current operation and difficulty
    const filteredCustomQuestions = customQuestions.filter(
      q => q.operation === operation && q.difficulty === difficulty
    );

    let newQuestion;

    if (filteredCustomQuestions.length > 0 && Math.random() < 0.3) {
      // Use a custom question 30% of the time if available
      const randomIndex = Math.floor(Math.random() * filteredCustomQuestions.length);
      newQuestion = filteredCustomQuestions[randomIndex];
    } else {
      // Generate a random question
      newQuestion = Utils.generateQuestion(operation, difficulty);
    }

    // Check if the question is a repeat
    const isRepeat = questionHistory.some(q => q.question === newQuestion.question);
    
    if (isRepeat && questionHistory.length < 20) {
      // Try again if it's a repeat
      return generateNewQuestion();
    }

    // Add to history and limit history size
    questionHistory.unshift(newQuestion);
    if (questionHistory.length > 20) {
      questionHistory = questionHistory.slice(0, 20);
    }

    currentQuestion = newQuestion;
    publish('questionChanged', currentQuestion);
    return currentQuestion;
  };

  // Check an answer
  const checkAnswer = (selectedAnswer) => {
    if (!currentQuestion) return false;
    
    const isCorrect = selectedAnswer === currentQuestion.answer;
    
    if (isCorrect) {
      score += 1;
      publish('scoreChanged', score);
      
      // Update current student score if one is selected
      if (currentStudent) {
        currentStudent.score += 1;
        currentStudent.correctAnswers += 1;
        currentStudent.totalQuestions += 1;
        
        // Update in the students array
        students = students.map(s => 
          s.id === currentStudent.id ? currentStudent : s
        );
        
        saveStudents();
        publish('studentUpdated', currentStudent);
      }
    } else if (currentStudent) {
      // Update the attempt count even if wrong
      currentStudent.totalQuestions += 1;
      
      // Update in the students array
      students = students.map(s => 
        s.id === currentStudent.id ? currentStudent : s
      );
      
      saveStudents();
      publish('studentUpdated', currentStudent);
    }
    
    return isCorrect;
  };

  // Toggle admin mode
  const toggleAdmin = () => {
    isAdmin = !isAdmin;
    publish('adminChanged', isAdmin);
  };

  // Add a custom question
  const addCustomQuestion = (question) => {
    const newQuestion = {
      ...question,
      id: Date.now().toString(),
    };
    
    customQuestions.push(newQuestion);
    saveCustomQuestions();
    publish('customQuestionsChanged', customQuestions);
  };

  // Remove a custom question
  const removeCustomQuestion = (id) => {
    customQuestions = customQuestions.filter(q => q.id !== id);
    saveCustomQuestions();
    publish('customQuestionsChanged', customQuestions);
  };

  // Save a student
  const saveStudent = (name, roll, className) => {
    // Check if student already exists by roll number
    const existingStudent = students.find(s => s.roll && s.roll.toLowerCase() === roll.toLowerCase());
    
    if (existingStudent) {
      currentStudent = existingStudent;
    } else {
      // Create new student
      const newStudent = {
        id: Date.now().toString(),
        name,
        roll,
        class: className,
        score: 0,
        totalQuestions: 0,
        correctAnswers: 0
      };
      
      students.push(newStudent);
      currentStudent = newStudent;
      saveStudents();
    }
    
    publish('currentStudentChanged', currentStudent);
  };

  // Reset quiz
  const resetQuiz = () => {
    score = 0;
    questionHistory = [];
    publish('scoreChanged', score);
    generateNewQuestion();
  };

  // Public API
  return {
    init: function() {
      loadData();
      return this;
    },
    getQuestion: () => currentQuestion,
    getScore: () => score,
    getDifficulty: () => difficulty,
    getOperation: () => operation,
    getStudents: () => students,
    getIsAdmin: () => isAdmin,
    getCustomQuestions: () => customQuestions,
    getQuestionHistory: () => questionHistory,
    getCurrentStudent: () => currentStudent,
    
    setDifficulty: (newDifficulty) => {
      difficulty = newDifficulty;
      generateNewQuestion();
      publish('difficultyChanged', difficulty);
    },
    
    setOperation: (newOperation) => {
      operation = newOperation;
      generateNewQuestion();
      publish('operationChanged', operation);
    },
    
    generateNewQuestion,
    checkAnswer,
    toggleAdmin,
    addCustomQuestion,
    removeCustomQuestion,
    saveStudent,
    resetQuiz,
    
    // Event subscription
    on: subscribe
  };
})().init();

// Display toast notifications
const Toast = (function() {
  // Create toast container if it doesn't exist
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Show a toast notification
  const show = (title, message, type = 'default') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const content = `
      <div class="toast-header">
        <strong>${title}</strong>
        <button class="toast-close">&times;</button>
      </div>
      <div class="toast-body">${message}</div>
    `;
    
    toast.innerHTML = content;
    container.appendChild(toast);
    
    // Add event listener for close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
      container.removeChild(toast);
    });
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
    }, 3000);
  };
  
  return {
    success: (title, message) => show(title, message, 'success'),
    error: (title, message) => show(title, message, 'error'),
    info: (title, message) => show(title, message, 'info'),
    default: (title, message) => show(title, message, 'default')
  };
})();
