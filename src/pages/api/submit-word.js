import Pusher from 'pusher';
import { games } from './create-game';
import { isValidWord, calculateWordScore } from '../../utils/wordValidator';

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

  const { gameId, playerId } = req.body;

  if (!gameId || !playerId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const game = games[gameId];
  if (!game) {
    return res.status(404).json({ message: 'Game not found' });
  }

  // Check if player exists in the game
  if (!game.players.some(p => p.id === playerId)) {
    return res.status(403).json({ message: 'Player not in this game' });
  }

  // Check if there's a current word
  if (!game.currentWord || game.currentWord.length < 3) {
    return res.status(400).json({ message: 'No valid word selected' });
  }

  // Validate the word
  if (!isValidWord(game.currentWord)) {
    return res.status(400).json({ message: 'Not a valid word' });
  }

  // Check if the word has already been found
  if (game.wordsFound.some(w => w.text === game.currentWord)) {
    return res.status(400).json({ message: 'Word already found' });
  }

  // Calculate the score
  const points = calculateWordScore(game.currentWord);
  
  // Add the word to found words
  game.wordsFound.push({
    text: game.currentWord,
    points,
    playerId
  });
  
  // Update the score
  game.score += points;
  
  // Clear the selected cells and current word
  game.selectedCells = [];
  game.currentWord = '';
  
  // Check if target score has been reached
  if (game.score >= game.targetScore) {
    game.status = 'ended';
  }
  
  // Notify all clients about the updated game state
  await pusher.trigger(`game-${gameId}`, 'game-updated', {
    gameState: game
  });

  return res.status(200).json({ success: true });
}