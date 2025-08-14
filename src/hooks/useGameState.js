import { useState, useCallback } from 'react';

export const useGameState = () => {
  const [gameState, setGameState] = useState({
    grid: [],
    players: [],
    score: 0,
    targetScore: 50,
    timeLeft: 180,
    wordsFound: [],
    selectedCells: [],
    currentWord: '',
    status: 'waiting'
  });

  const updateGameState = useCallback((newState) => {
    setGameState(prevState => ({
      ...prevState,
      ...newState
    }));
  }, []);

  const selectCell = useCallback((row, col) => {
    setGameState(prevState => {
      // Check if cell is already selected
      const alreadySelected = prevState.selectedCells.some(
        cell => cell.row === row && cell.col === col
      );

      // If it's the last selected cell, remove it (deselect)
      if (alreadySelected && 
          prevState.selectedCells.length > 0 && 
          prevState.selectedCells[prevState.selectedCells.length - 1].row === row && 
          prevState.selectedCells[prevState.selectedCells.length - 1].col === col) {
        
        const newSelectedCells = [...prevState.selectedCells];
        newSelectedCells.pop();
        
        // Update current word
        let newWord = '';
        newSelectedCells.forEach(cell => {
          newWord += prevState.grid[cell.row][cell.col];
        });
        
        return {
          ...prevState,
          selectedCells: newSelectedCells,
          currentWord: newWord
        };
      }

      // Check if it's adjacent to the last selected cell
      if (prevState.selectedCells.length > 0) {
        const lastCell = prevState.selectedCells[prevState.selectedCells.length - 1];
        const rowDiff = Math.abs(row - lastCell.row);
        const colDiff = Math.abs(col - lastCell.col);
        
        if (rowDiff > 1 || colDiff > 1 || (rowDiff === 0 && colDiff === 0)) {
          return prevState; // Not adjacent, don't select
        }
      }

      if (!alreadySelected) {
        const newSelectedCells = [...prevState.selectedCells, { row, col }];
        
        // Update current word
        let newWord = '';
        newSelectedCells.forEach(cell => {
          newWord += prevState.grid[cell.row][cell.col];
        });
        
        return {
          ...prevState,
          selectedCells: newSelectedCells,
          currentWord: newWord
        };
      }
      
      return prevState;
    });
  }, []);

  const resetSelection = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      selectedCells: [],
      currentWord: ''
    }));
  }, []);

  return { 
    gameState, 
    updateGameState,
    selectCell,
    resetSelection
  };
};