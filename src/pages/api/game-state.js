import { games } from './create-game';

export default function handler(req, res) {
  const { gameId } = req.query;

  if (!gameId) {
    return res.status(400).json({ message: 'Game ID is required' });
  }

  const game = games[gameId];
  if (!game) {
    return res.status(404).json({ message: 'Game not found' });
  }

  return res.status(200).json({ gameState: game });
}