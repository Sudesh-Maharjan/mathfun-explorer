
import { Question, Difficulty, Operation } from '../context/QuizContext';

// Generate a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Get difficulty ranges for each operation
const getDifficultyRange = (operation: Operation, difficulty: Difficulty): { min1: number; max1: number; min2: number; max2: number } => {
  switch (operation) {
    case 'addition':
      if (difficulty === 'easy') return { min1: 1, max1: 10, min2: 1, max2: 10 };
      if (difficulty === 'medium') return { min1: 10, max1: 50, min2: 10, max2: 50 };
      return { min1: 50, max1: 100, min2: 50, max2: 100 };
      
    case 'subtraction':
      if (difficulty === 'easy') return { min1: 5, max1: 20, min2: 1, max2: 5 };
      if (difficulty === 'medium') return { min1: 20, max1: 50, min2: 10, max2: 20 };
      return { min1: 50, max1: 100, min2: 25, max2: 50 };
      
    case 'multiplication':
      if (difficulty === 'easy') return { min1: 1, max1: 5, min2: 1, max2: 5 };
      if (difficulty === 'medium') return { min1: 2, max1: 10, min2: 2, max2: 10 };
      return { min1: 5, max1: 12, min2: 5, max2: 12 };
      
    case 'division':
      if (difficulty === 'easy') {
        // For easy division, we'll generate multiplication first, then convert to division
        return { min1: 1, max1: 5, min2: 1, max2: 5 };
      }
      if (difficulty === 'medium') {
        return { min1: 2, max1: 10, min2: 2, max2: 10 };
      }
      return { min1: 5, max1: 12, min2: 2, max2: 10 };
      
    default:
      return { min1: 1, max1: 10, min2: 1, max2: 10 };
  }
};

// Generate wrong answers that are close to the correct answer
const generateOptions = (correctAnswer: number, operation: Operation, difficulty: Difficulty): number[] => {
  const options: number[] = [correctAnswer];
  
  // Determine how far off the wrong answers can be
  let range = 3; // default
  if (difficulty === 'medium') range = 5;
  if (difficulty === 'hard') range = 8;
  
  // Special case for multiplication and division - make wrong answers multiples or common mistakes
  if (operation === 'multiplication' || operation === 'division') {
    range = Math.max(2, Math.floor(correctAnswer * 0.3)); // 30% off but at least 2
  }
  
  // Generate 3 wrong answers
  while (options.length < 4) {
    let wrongAnswer;
    const offset = getRandomInt(1, range);
    const plusMinus = Math.random() > 0.5 ? 1 : -1;
    
    wrongAnswer = correctAnswer + (offset * plusMinus);
    
    // Make sure wrong answer is positive
    if (wrongAnswer <= 0) {
      wrongAnswer = correctAnswer + offset;
    }
    
    // Add 1-off errors for more plausible wrong answers
    if (options.length === 1 && operation === 'multiplication') {
      // Common multiplication error: off by the multiplier
      const factor = getRandomInt(1, 5);
      wrongAnswer = correctAnswer + factor;
    }
    
    // Don't add duplicates
    if (!options.includes(wrongAnswer)) {
      options.push(wrongAnswer);
    }
  }
  
  // Shuffle the options
  return options.sort(() => Math.random() - 0.5);
};

// Generate a question for a specific operation and difficulty
export const generateQuestion = (operation: Operation, difficulty: Difficulty): Question => {
  const range = getDifficultyRange(operation, difficulty);
  let num1: number, num2: number, answer: number, questionText: string;
  
  switch (operation) {
    case 'addition':
      num1 = getRandomInt(range.min1, range.max1);
      num2 = getRandomInt(range.min2, range.max2);
      answer = num1 + num2;
      questionText = `${num1} + ${num2} = ?`;
      break;
      
    case 'subtraction':
      // Ensure result is positive
      num1 = getRandomInt(range.min1, range.max1);
      num2 = getRandomInt(range.min2, Math.min(range.max2, num1));
      answer = num1 - num2;
      questionText = `${num1} - ${num2} = ?`;
      break;
      
    case 'multiplication':
      num1 = getRandomInt(range.min1, range.max1);
      num2 = getRandomInt(range.min2, range.max2);
      answer = num1 * num2;
      questionText = `${num1} × ${num2} = ?`;
      break;
      
    case 'division':
      if (difficulty === 'easy') {
        // Generate clean division problems for easy difficulty
        num2 = getRandomInt(range.min2, range.max2);
        answer = getRandomInt(range.min1, range.max1);
        num1 = num2 * answer; // This ensures division has no remainder
      } else {
        // For medium and hard, we'll allow some remainders but still have mostly clean division
        num2 = getRandomInt(range.min2, range.max2);
        const hasRemainder = Math.random() > 0.7; // 30% chance of having a remainder
        
        if (hasRemainder && difficulty === 'hard') {
          // Create a division with remainder
          answer = getRandomInt(range.min1, range.max1);
          const remainder = getRandomInt(1, num2 - 1);
          num1 = (num2 * answer) + remainder;
        } else {
          // Clean division
          answer = getRandomInt(range.min1, range.max1);
          num1 = num2 * answer;
        }
      }
      questionText = `${num1} ÷ ${num2} = ?`;
      break;
      
    default:
      num1 = getRandomInt(1, 10);
      num2 = getRandomInt(1, 10);
      answer = num1 + num2;
      questionText = `${num1} + ${num2} = ?`;
  }
  
  const options = generateOptions(answer, operation, difficulty);
  
  return {
    id: Date.now().toString(),
    question: questionText,
    answer,
    options,
    operation,
    difficulty
  };
};
