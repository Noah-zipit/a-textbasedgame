import styled from 'styled-components';
import { motion } from 'framer-motion';

export default function PlayerControls({ players, currentPlayerId, onUsePower }) {
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  
  function handleUsePower() {
    if (currentPlayer && currentPlayer.powerReady) {
      onUsePower(currentPlayer.powerType);
    }
  }
  
  // Descriptions for each power type
  const powerDescriptions = {
    SWAP: "Swap the positions of two letters on the grid",
    TRANSFORM: "Change any letter on the grid to a different letter",
    FREEZE: "Pause the timer for 10 seconds"
  };
  
  return (
    <Container>
      <Title>Players</Title>
      
      {players.map(player => (
        <PlayerCard 
          key={player.id}
          isCurrent={player.id === currentPlayerId}
          animate={{
            scale: player.id === currentPlayerId ? 1.02 : 1,
            boxShadow: player.id === currentPlayerId 
              ? '0 0 15px rgba(77, 166, 255, 0.3)' 
              : 'none'
          }}
        >
          <PlayerHeader>
            <PlayerName>{player.name}</PlayerName>
            {player.id === currentPlayerId && <CurrentPlayerBadge>You</CurrentPlayerBadge>}
          </PlayerHeader>
          
          <PowerInfo>
            <PowerDetails>
              <PowerType>{player.powerType}</PowerType>
              <PowerDescription>{powerDescriptions[player.powerType]}</PowerDescription>
            </PowerDetails>
            
            {player.id === currentPlayerId && (
              <PowerButton 
                onClick={handleUsePower}
                disabled={!player.powerReady}
                whileHover={{ scale: player.powerReady ? 1.05 : 1 }}
                whileTap={{ scale: player.powerReady ? 0.95 : 1 }}
              >
                {player.powerReady ? 'Use Power' : 'Cooling Down'}
              </PowerButton>
            )}
          </PowerInfo>
        </PlayerCard>
      ))}
    </Container>
  );
}

const Container = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
  text-align: center;
`;

const PlayerCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, ${props => props.isCurrent ? '0.2' : '0.1'});
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
`;

const PlayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const PlayerName = styled.div`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
`;

const CurrentPlayerBadge = styled.div`
  background: rgba(77, 166, 255, 0.2);
  color: #4da6ff;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const PowerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const PowerDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const PowerType = styled.span`
  color: #4da6ff;
  font-weight: 600;
  font-size: 1rem;
`;

const PowerDescription = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
`;

const PowerButton = styled(motion.button)`
  width: 100%;
  padding: 0.7rem 1rem;
  background: ${props => props.disabled ? 'rgba(77, 166, 255, 0.3)' : 'linear-gradient(135deg, #4da6ff, #1e5799)'};
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? '0.7' : '1'};
`;