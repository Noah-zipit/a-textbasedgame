import Pusher from 'pusher';
import { games } from './create-game';

// Initialize Pusher with your credentials
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { gameId, playerId, row, col } = req.body;

  if (!gameId || !playerId || row === undefined || col === undefined) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  const game = games[gameId];

  if (!game) {
    return res.status(404).json({ message: 'Game not found' });
  }

  if (game.status !== 'playing') {
    return res.status(400).json({ message: 'Game is not in progress' });
  }

  // Check if this player exists in the game
  if (!game.players.some(p => p.id === playerId)) {
    return res.status(403).json({ message: 'Player not in this game' });
  }

  // Check if the cell is already selected
  const alreadySelected = game.selectedCells.some(
    cell => cell.row === row && cell.col === col
  );

  if (alreadySelected) {
    // If it's the last cell selected, deselect it
    if (game.selectedCells.length > 0 && 
        game.selectedCells[game.selectedCells.length - 1].row === row && 
        game.selectedCells[game.selectedCells.length - 1].col === col) {
      
      game.selectedCells.pop();
      
      // Update the current word
      updateCurrentWord(game);
      
      // Notify all clients about the updated game state
      await pusher.trigger(`game-${gameId}`, 'game-updated', {
        gameState: game
      });
      
      return res.status(200).json({ success: true });
    }
    
    return res.status(400).json({ message: 'Cell already selected' });
  }

  // Check if the cell is adjacent to the last selected cell
  const isFirstSelection = game.selectedCells.length === 0;
  const isAdjacent = isFirstSelection || isAdjacentToLastCell(game.selectedCells, row, col);

  if (!isFirstSelection && !isAdjacent) {
    return res.status(400).json({ message: 'Cell must be adjacent to the last selected cell' });
  }

  // Add the selected cell to the game state
  game.selectedCells.push({ row, col, playerId });
  
  // Update the current word
  updateCurrentWord(game);
  
  // Notify all clients about the updated game state
  await pusher.trigger(`game-${gameId}`, 'game-updated', {
    gameState: game
  });

  return res.status(200).json({ success: true });
}

function isAdjacentToLastCell(selectedCells, row, col) {
  const lastCell = selectedCells[selectedCells.length - 1];
  
  // Check if the cell is adjacent (horizontally, vertically, or diagonally)
  const rowDiff = Math.abs(row - lastCell.row);
  const colDiff = Math.abs(col - lastCell.col);
  
  return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
}

function updateCurrentWord(game) {
  if (game.selectedCells.length === 0) {
    game.currentWord = '';
    return;
  }
  
  // Construct the current word from the selected cells
  let word = '';
  for (const cell of game.selectedCells) {
    word += game.grid[cell.row][cell.col];
  }
  
  game.currentWord = word;
}