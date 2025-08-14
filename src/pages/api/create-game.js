import { v4 as uuidv4 } from 'uuid';
import Pusher from 'pusher';

// Initialize Pusher with your credentials
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true
});

// In-memory storage for development purposes only
// In production, use a database like MongoDB or Redis
const games = {};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { hostName } = req.body;

  if (!hostName) {
    return res.status(400).json({ message: 'Player name is required' });
  }

  // Generate a unique game ID
  const gameId = uuidv4().substring(0, 8);
  const hostId = uuidv4();

  // Generate a 4x4 grid of random letters
  const grid = generateLetterGrid();

  // Create initial game state
  const gameState = {
    grid,
    players: [
      {
        id: hostId,
        name: hostName,
        powerType: 'SWAP',
        powerReady: true
      }
    ],
    score: 0,
    targetScore: 50,
    timeLeft: 180, // 3 minutes
    wordsFound: [],
    selectedCells: [],
    currentWord: '',
    status: 'waiting' // waiting, playing, ended
  };

  // Store the game state
  games[gameId] = gameState;

  return res.status(200).json({ gameId, playerId: hostId, gameState });
}

function generateLetterGrid() {
  const vowels = 'AEIOU';
  const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
  const grid = [];

  // Ensure a good distribution of vowels and consonants
  for (let i = 0; i < 4; i++) {
    const row = [];
    for (let j = 0; j < 4; j++) {
      // 40% chance of vowel, 60% chance of consonant
      const isVowel = Math.random() < 0.4;
      const pool = isVowel ? vowels : consonants;
      row.push(pool.charAt(Math.floor(Math.random() * pool.length)));
    }
    grid.push(row);
  }

  return grid;
}

// Export games object for other API routes to access
export { games };