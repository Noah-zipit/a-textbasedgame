import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { motion } from 'framer-motion';

export default function Home() {
  const [playerName, setPlayerName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  async function createGame() {
    if (!playerName.trim()) return;
    
    setIsCreating(true);
    try {
      const res = await fetch('/api/create-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostName: playerName })
      });
      const { gameId } = await res.json();
      router.push(`/game/${gameId}`);
    } catch (error) {
      console.error(error);
      setIsCreating(false);
    }
  }

  return (
    <Container>
      <Title
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        WORD<GlowText>FORGE</GlowText>
      </Title>
      
      <InputWrapper>
        <Input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
      </InputWrapper>

      <Button
        onClick={createGame}
        disabled={!playerName || isCreating}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {isCreating ? 'Creating...' : 'Create New Game'}
      </Button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #0f0f1a;
  padding: 2rem;
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
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

const Input = styled(motion.input)`
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