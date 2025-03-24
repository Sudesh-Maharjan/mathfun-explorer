// Utility functions
const Utils = (function() {
  // Generate a unique ID
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  // Generate a random number between min and max (inclusive)
  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Generate a math question
  const generateQuestion = (operation, difficulty) => {
    let num1, num2, answer, question, options;
    
    // Define difficulty ranges
    const ranges = {
      easy: { min: 1, max: 10 },
      medium: { min: 10, max: 50 },
      hard: { min: 50, max: 100 }
    };
    
    const { min, max } = ranges[difficulty];
    
    switch (operation) {
      case 'addition':
        num1 = randomNumber(min, max);
        num2 = randomNumber(min, max);
        answer = num1 + num2;
        question = `${num1} + ${num2} = ?`;
        break;
        
      case 'subtraction':
        // Ensure the result is positive
        num1 = randomNumber(min, max);
        num2 = randomNumber(min, num1);
        answer = num1 - num2;
        question = `${num1} - ${num2} = ?`;
        break;
        
      case 'multiplication':
        // Adjust ranges for multiplication to keep answers manageable
        const multMin = difficulty === 'easy' ? 1 : 2;
        const multMax = difficulty === 'easy' ? 10 : (difficulty === 'medium' ? 12 : 15);
        
        num1 = randomNumber(multMin, multMax);
        num2 = randomNumber(multMin, multMax);
        answer = num1 * num2;
        question = `${num1} × ${num2} = ?`;
        break;
        
      case 'division':
        // Create division questions that result in whole numbers
        num2 = randomNumber(1, difficulty === 'easy' ? 10 : (difficulty === 'medium' ? 12 : 15));
        
        // For difficulty, adjust the multiplier
        const multiplier = difficulty === 'easy' ? randomNumber(1, 5) : 
                          (difficulty === 'medium' ? randomNumber(1, 10) : randomNumber(1, 20));
        
        num1 = num2 * multiplier;
        answer = multiplier;
        question = `${num1} ÷ ${num2} = ?`;
        break;
        
      default:
        return generateQuestion('addition', difficulty);
    }
    
    // Generate options
    options = generateOptions(answer, operation, difficulty);
    
    return {
      id: generateId(),
      question,
      options,
      answer,
      operation,
      difficulty
    };
  };

  // Generate options for a question
  const generateOptions = (correctAnswer, operation, difficulty) => {
    const options = [correctAnswer];
    
    // Define how different the wrong answers should be
    const difficultyFactors = {
      easy: { variance: 2, count: 3 },
      medium: { variance: 3, count: 4 },
      hard: { variance: 5, count: 4 }
    };
    
    const { variance, count } = difficultyFactors[difficulty];
    
    // Generate wrong answers
    while (options.length < count) {
      let wrongAnswer;
      
      if (operation === 'multiplication' || operation === 'division') {
        // For multiplication and division, generate more realistic wrong answers
        const offset = randomNumber(1, variance * 2);
        wrongAnswer = Math.random() < 0.5 ? correctAnswer + offset : correctAnswer - offset;
      } else {
        // For addition and subtraction, use variance
        wrongAnswer = correctAnswer + randomNumber(-variance, variance);
      }
      
      // Ensure the wrong answer is positive and not duplicate
      if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }
    
    // Shuffle options
    return shuffleArray(options);
  };

  // Shuffle an array
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Format date
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  return {
    generateId,
    randomNumber,
    generateQuestion,
    generateOptions,
    shuffleArray,
    formatDate
  };
})();
