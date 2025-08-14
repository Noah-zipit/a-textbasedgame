import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Pusher from 'pusher-js';
import GameBoard from '../../components/GameBoard';
import PlayerControls from '../../components/PlayerControls';
import ScoreTracker from '../../components/ScoreTracker';
import Timer from '../../components/Timer';

export default function GameRoom() {
  const router = useRouter();
  const { id: gameId } = router.query;
  const [gameState, setGameState] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [gameLoaded, setGameLoaded] = useState(false);

  useEffect(() => {
    if (!gameId) return;

    // Check if game exists and get initial state
    async function fetchGameState() {
      try {
        const res = await fetch(`/api/game-state?gameId=${gameId}`);
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || 'Failed to fetch game');
        }
        const data = await res.json();
        setGameState(data.gameState);
        setGameLoaded(true);
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    }

    fetchGameState();
  }, [gameId]);

  useEffect(() => {
    if (!gameId || !playerId) return;
    
    // Initialize Pusher with your credentials
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      forceTLS: true
    });

    const channel = pusher.subscribe(`game-${gameId}`);
    channel.bind('game-updated', (data) => {
      setGameState(data.gameState);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [gameId, playerId]);

  async function joinGame() {
    if (!playerName.trim()) return;
    
    setIsJoining(true);
    try {
      const res = await fetch('/api/join-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, playerName })
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to join game');
      }
      
      const data = await res.json();
      setPlayerId(data.playerId);
      setGameState(data.gameState);
      localStorage.setItem(`game-${gameId}-player`, data.playerId);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsJoining(false);
    }
  }

  async function handleCellSelect(row, col) {
    if (!gameId || !playerId) return;
    
    try {
      const res = await fetch('/api/select-cell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, playerId, row, col })
      });
      
      if (!res.ok) {
        const error = await res.json();
        console.error(error.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUsePower(powerType, params = {}) {
    if (!gameId || !playerId) return;
    
    try {
      const res = await fetch('/api/use-power', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          gameId, 
          playerId, 
          powerType,
          ...params
        })
      });
      
      if (!res.ok) {
        const error = await res.json();
        console.error(error.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function submitWord() {
    if (!gameId || !playerId || !gameState || !gameState.currentWord) return;
    
    try {
      const res = await fetch('/api/submit-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, playerId })
      });
      
      if (!res.ok) {
        const error = await res.json();
        console.error(error.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Check if we already have a player ID for this game
  useEffect(() => {
    if (gameId && !playerId) {
      const storedPlayerId = localStorage.getItem(`game-${gameId}-player`);
      if (storedPlayerId) {
        setPlayerId(storedPlayerId);
      }
    }
  }, [gameId, playerId]);

  if (!gameId || !gameLoaded) return (
    <LoadingContainer>
      <LoadingText>Loading game...</LoadingText>
    </LoadingContainer>
  );
  
  if (error) return (
    <ErrorContainer>
      <ErrorTitle>Error</ErrorTitle>
      <ErrorMessage>{error}</ErrorMessage>
      <Button onClick={() => router.push('/')}>Back to Home</Button>
    </ErrorContainer>
  );
  
  if (!playerId) {
    return (
      <Container>
        <Title>Join Game</Title>
        {error && <ErrorNotification>{error}</ErrorNotification>}
        <GameInfoCard>
          <GameInfoText>Players: {gameState?.players.length || 0}/3</GameInfoText>
          {gameState?.status === 'waiting' ? (
            <GameStatusBadge>Waiting for players</GameStatusBadge>
          ) : (
            <GameStatusBadge>Game in progress</GameStatusBadge>
          )}
        </GameInfoCard>
        <InputWrapper>
          <Input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </InputWrapper>
        <Button
          onClick={joinGame}
          disabled={!playerName || isJoining || gameState?.players.length >= 3 || gameState?.status !== 'waiting'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isJoining ? 'Joining...' : 'Join Game'}
        </Button>
        {(gameState?.players.length >= 3 || gameState?.status !== 'waiting') && (
          <JoinErrorMessage>
            {gameState?.players.length >= 3 ? 'Game is full' : 'Game has already started'}
          </JoinErrorMessage>
        )}
      </Container>
    );
  }

  if (!gameState) return <div>Loading game state...</div>;

  const currentPlayer = gameState.players.find(p => p.id === playerId);

  return (
    <GameContainer>
      <GameHeader>
        <Title>WORD<GlowText>FORGE</GlowText></Title>
        <Timer timeLeft={gameState.timeLeft} />
      </GameHeader>
      
      <GameContent>
        <GameBoard 
          grid={gameState.grid} 
          selectedCells={gameState.selectedCells}
          onCellSelect={handleCellSelect}
          currentWord={gameState.currentWord}
        />
        
        <GameSidebar>
          <ScoreTracker 
            score={gameState.score} 
            targetScore={gameState.targetScore}
            wordsFound={gameState.wordsFound}
          />
          
          <PlayerControls 
            players={gameState.players}
            currentPlayerId={playerId}
            onUsePower={handleUsePower}
          />
          
          {gameState.currentWord && (
            <SubmitWordButton
              onClick={submitWord}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Word
            </SubmitWordButton>
          )}
        </GameSidebar>
      </GameContent>
      
      {gameState.status === 'ended' && (
        <GameOverOverlay>
          <GameOverCard>
            <GameOverTitle>
              {gameState.score >= gameState.targetScore ? 'Victory!' : 'Time\'s Up!'}
            </GameOverTitle>
            <GameOverScore>
              Final Score: <ScoreValue>{gameState.score}</ScoreValue>/{gameState.targetScore}
            </GameOverScore>
            <Button onClick={() => router.push('/')}>Back to Home</Button>
          </GameOverCard>
        </GameOverOverlay>
      )}
    </GameContainer>
  );
}

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #0f0f1a;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 900;
  letter-spacing: 0.15em;
  color: #ffffff;
  text-align: center;
`;

const GlowText = styled.span`
  color: #4da6ff;
  text-shadow: 0 0 10px #4da6ff, 0 0 20px #4da6ff, 0 0 30px #4da6ff;
`;

const InputWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  font-size: 1.1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4da6ff;
    box-shadow: 0 0 0 2px rgba(77, 166, 255, 0.3);
  }
`;

const Button = styled(motion.button)`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #4da6ff, #1e5799);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(77, 166, 255, 0.4);

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SubmitWordButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #22c55e, #15803d);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
`;

const ErrorNotification = styled.div`
  color: #ff4d4d;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 500;
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #0f0f1a;
  padding: 1rem;
`;

const GameHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const GameContent = styled.div`
  display: flex;
  flex: 1;
  padding: 1rem;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const GameSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 300px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const GameInfoCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GameInfoText = styled.div`
  color: #ffffff;
  font-size: 1rem;
`;

const GameStatusBadge = styled.div`
  background: rgba(77, 166, 255, 0.2);
  color: #4da6ff;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const JoinErrorMessage = styled.div`
  color: #ff4d4d;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0f0f1a;
`;

const LoadingText = styled.div`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 500;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0f0f1a;
  padding: 2rem;
  text-align: center;
`;

const ErrorTitle = styled.h1`
  color: #ff4d4d;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  color: #ffffff;
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const GameOverOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const GameOverCard = styled.div`
  background: rgba(15, 15, 26, 0.95);
  border: 1px solid rgba(77, 166, 255, 0.3);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90%;
  width: 400px;
`;

const GameOverTitle = styled.h2`
  color: #4da6ff;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 10px rgba(77, 166, 255, 0.5);
`;

const GameOverScore = styled.div`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const ScoreValue = styled.span`
  color: #4da6ff;
  font-weight: 700;
`;