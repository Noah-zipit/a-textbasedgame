import { validateWord } from './wordValidator';

// Generate a random letter grid with a good distribution of vowels and consonants
export const generateGrid = (rows = 4, cols = 4) => {
  const vowels = 'AEIOU';
  const commonConsonants = 'RSTLNMBD';
  const rareConsonants = 'CFGHJKPQVWXYZ';
  const grid = [];

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const random = Math.random();
      let letter;
      
      if (random < 0.35) {
        // 35% chance of vowel
        letter = vowels.charAt(Math.floor(Math.random() * vowels.length));
      } else if (random < 0.85) {
        // 50% chance of common consonant
        letter = commonConsonants.charAt(Math.floor(Math.random() * commonConsonants.length));
      } else {
        // 15% chance of rare consonant
        letter = rareConsonants.charAt(Math.floor(Math.random() * rareConsonants.length));
      }
      
      row.push(letter);
    }
    grid.push(row);
  }

  return grid;
};

// Check if a word can be formed on the grid from the selected cells
export const validateWordPath = (word, selectedCells, grid) => {
  if (!word || selectedCells.length === 0) return false;
  
  // Check if the path forms the word
  let pathWord = '';
  for (const cell of selectedCells) {
    pathWord += grid[cell.row][cell.col];
  }
  
  return pathWord.toUpperCase() === word.toUpperCase();
};

// Submit a word and update the game state
export const submitWord = (gameState) => {
  const { currentWord, selectedCells, grid, wordsFound } = gameState;
  
  // Validate the word
  const validationResult = validateWord(currentWord);
  
  if (!validationResult.valid) {
    return {
      ...gameState,
      selectedCells: [],
      currentWord: '',
      message: validationResult.message
    };
  }
  
  // Check if the word has already been found
  if (wordsFound.some(w => w.text.toUpperCase() === currentWord.toUpperCase())) {
    return {
      ...gameState,
      selectedCells: [],
      currentWord: '',
      message: 'Word already found'
    };
  }
  
  // Add the word to the found words list
  const newWordsFound = [
    ...wordsFound,
    {
      text: currentWord,
      points: validationResult.points
    }
  ];
  
  // Update the score
  const newScore = gameState.score + validationResult.points;
  
  // Check if the target score has been reached
  const gameWon = newScore >= gameState.targetScore;
  
  return {
    ...gameState,
    wordsFound: newWordsFound,
    score: newScore,
    selectedCells: [],
    currentWord: '',
    message: `${currentWord} (+${validationResult.points} points)`,
    status: gameWon ? 'ended' : gameState.status
  };
};

// Apply a power effect to the game state
export const applyPower = (gameState, powerType, params = {}) => {
  let newGameState = { ...gameState };
  
  switch (powerType) {
    case 'SWAP':
      if (params.cell1 && params.cell2) {
        const grid = [...gameState.grid];
        const temp = grid[params.cell1.row][params.cell1.col];
        grid[params.cell1.row][params.cell1.col] = grid[params.cell2.row][params.cell2.col];
        grid[params.cell2.row][params.cell2.col] = temp;
        
        newGameState.grid = grid;
        newGameState.message = 'Letters swapped!';
      }
      break;
      
    case 'TRANSFORM':
      if (params.cell && params.letter) {
        const grid = [...gameState.grid];
        grid[params.cell.row][params.cell.col] = params.letter.toUpperCase();
        
        newGameState.grid = grid;
        newGameState.message = 'Letter transformed!';
      }
      break;
      
    case 'FREEZE':
      newGameState.timeLeft += 10; // Add 10 seconds
      newGameState.message = 'Time extended by 10 seconds!';
      break;
      
    default:
      break;
  }
  
  return newGameState;
};

// Start a new game
export const initializeGame = (players) => {
  return {
    grid: generateGrid(),
    players,
    score: 0,
    targetScore: 50,
    timeLeft: 180, // 3 minutes
    wordsFound: [],
    selectedCells: [],
    currentWord: '',
    status: players.length === 3 ? 'playing' : 'waiting',
    message: ''
  };
};