import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

export default function Timer({ timeLeft }) {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    // Flash when time is running low (less than 30 seconds)
    setIsFlashing(timeLeft < 30);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Container isFlashing={isFlashing}>
      <TimeIcon>⏱</TimeIcon>
      <TimeDisplay>
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </TimeDisplay>
    </Container>
  );
}

const Container = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${props => props.isFlashing ? 'flash 1s infinite alternate' : 'none'};
  
  @keyframes flash {
    from {
      background: rgba(0, 0, 0, 0.3);
    }
    to {
      background: rgba(255, 59, 59, 0.3);
    }
  }
`;

const TimeIcon = styled.span`
  color: #ffffff;
  font-size: 1.2rem;
`;

const TimeDisplay = styled.div`
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 700;
  font-family: monospace;
`;