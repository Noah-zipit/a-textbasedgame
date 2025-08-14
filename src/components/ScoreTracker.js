import styled from 'styled-components';
import { motion } from 'framer-motion';

export default function ScoreTracker({ score, targetScore, wordsFound }) {
  const progressPercentage = (score / targetScore) * 100;
  
  return (
    <Container>
      <ScoreHeader>
        <Title>Score</Title>
        <ScoreDisplay>
          <CurrentScore>{score}</CurrentScore>/
          <TargetScore>{targetScore}</TargetScore>
        </ScoreDisplay>
      </ScoreHeader>
      
      <ProgressBarContainer>
        <ProgressBar 
          style={{ width: `${progressPercentage}%` }}
          animate={{
            width: `${progressPercentage}%`
          }}
          transition={{ duration: 0.5 }}
        />
      </ProgressBarContainer>
      
      <WordsFoundContainer>
        <WordsFoundHeader>Words Found:</WordsFoundHeader>
        {wordsFound.length === 0 ? (
          <NoWordsFound>No words found yet</NoWordsFound>
        ) : (
          <WordsList>
            {wordsFound.map((word, index) => (
              <WordItem 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {word.text} 
                <WordScore>+{word.points}</WordScore>
              </WordItem>
            ))}
          </WordsList>
        )}
      </WordsFoundContainer>
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

const ScoreHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  margin: 0;
`;

const ScoreDisplay = styled.div`
  display: flex;
  align-items: baseline;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
`;

const CurrentScore = styled.span`
  color: #4da6ff;
  font-size: 1.8rem;
  font-weight: 700;
  margin-right: 0.2rem;
`;

const TargetScore = styled.span`
  font-size: 1.2rem;
  margin-left: 0.2rem;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  overflow: hidden;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #4da6ff, #1e5799);
  border-radius: 5px;
`;

const WordsFoundContainer = styled.div`
  margin-top: 1rem;
`;

const WordsFoundHeader = styled.h3`
  color: #ffffff;
  font-size: 1.2rem;
  margin: 0 0 0.8rem;
`;

const NoWordsFound = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  text-align: center;
  padding: 1rem 0;
`;

const WordsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
`;

const WordItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  color: #ffffff;
  font-weight: 500;
`;

const WordScore = styled.span`
  color: #4da6ff;
  font-weight: 600;
`;