import Pusher from 'pusher';
import { v4 as uuidv4 } from 'uuid';
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

  const { gameId, playerName } = req.body;

  if (!gameId || !playerName) {
    return res.status(400).json({ message: 'Game ID and player name are required' });
  }

  const game = games[gameId];

  if (!game) {
    return res.status(404).json({ message: 'Game not found' });
  }

  if (game.players.length >= 3) {
    return res.status(400).json({ message: 'Game is full' });
  }

  if (game.status !== 'waiting') {
    return res.status(400).json({ message: 'Game has already started' });
  }

  // Generate a unique player ID
  const playerId = uuidv4();

  // Assign a power type based on the number of players
  let powerType;
  if (game.players.length === 1) {
    powerType = 'TRANSFORM';
  } else {
    powerType = 'FREEZE';
  }

  // Add the player to the game
  game.players.push({
    id: playerId,
    name: playerName,
    powerType,
    powerReady: true
  });

  // If we now have 3 players, start the game
  if (game.players.length === 3) {
    game.status = 'playing';
    
    // Start a timer that updates the game state every second
    startGameTimer(gameId);
  }

  // Notify all clients about the new player
  await pusher.trigger(`game-${gameId}`, 'game-updated', {
    gameState: game
  });

  return res.status(200).json({ playerId, gameState: game });
}

function startGameTimer(gameId) {
  const game = games[gameId];
  if (!game) return;
  
  const interval = setInterval(async () => {
    game.timeLeft -= 1;
    
    // Check if time has run out
    if (game.timeLeft <= 0) {
      game.timeLeft = 0;
      game.status = 'ended';
      clearInterval(interval);
    }
    
    // Update all clients
    await pusher.trigger(`game-${gameId}`, 'game-updated', {
      gameState: game
    });
    
    // Clean up if game is over
    if (game.status === 'ended') {
      // In a real app, you might want to keep the game data for a while
      // before deleting it, so players can see the final results
      setTimeout(() => {
        delete games[gameId];
      }, 3600000); // Clean up after 1 hour
    }
  }, 1000);
}