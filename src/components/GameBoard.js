import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

export default function GameBoard({ grid, selectedCells, onCellSelect, currentWord }) {
  const [hoveredCell, setHoveredCell] = useState(null);
  
  function handleCellClick(rowIndex, colIndex) {
    onCellSelect(rowIndex, colIndex);
  }
  
  // Check if a cell is part of the current word path
  function isCellSelected(rowIndex, colIndex) {
    return selectedCells.some(
      cell => cell.row === rowIndex && cell.col === colIndex
    );
  }
  
  // Get the order number of this cell in the selected path
  function getSelectionOrder(rowIndex, colIndex) {
    const index = selectedCells.findIndex(
      cell => cell.row === rowIndex && cell.col === colIndex
    );
    return index >= 0 ? index + 1 : null;
  }
  
  return (
    <BoardContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CurrentWordDisplay>
        {currentWord ? currentWord : <PlaceholderText>Select letters to form a word</PlaceholderText>}
      </CurrentWordDisplay>
      
      <Grid>
        {grid.map((row, rowIndex) => (
          <Row key={rowIndex}>
            {row.map((letter, colIndex) => {
              const isSelected = isCellSelected(rowIndex, colIndex);
              const orderNumber = getSelectionOrder(rowIndex, colIndex);
              
              return (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  isSelected={isSelected}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                  onMouseLeave={() => setHoveredCell(null)}
                  animate={{
                    scale: isSelected ? 1.1 : 1,
                    backgroundColor: isSelected 
                      ? 'rgba(77, 166, 255, 0.3)' 
                      : hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {letter}
                  {isSelected && <OrderNumber>{orderNumber}</OrderNumber>}
                </Cell>
              );
            })}
          </Row>
        ))}
      </Grid>
    </BoardContainer>
  );
}

const BoardContainer = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 2rem;
`;

const CurrentWordDisplay = styled.div`
  height: 50px;
  width: 100%;
  max-width: 600px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.1em;
`;

const PlaceholderText = styled.span`
  color: rgba(255, 255, 255, 0.4);
  font-size: 1rem;
  font-weight: 400;
  font-style: italic;
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 600px;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const Cell = styled(motion.div)`
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 700;
  cursor: pointer;
  user-select: none;
  box-shadow: ${props => props.isSelected ? '0 0 10px rgba(77, 166, 255, 0.5)' : 'none'};
  
  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 1.4rem;
  }
  
  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }
`;

const OrderNumber = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 18px;
  height: 18px;
  background: #4da6ff;
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 480px) {
    width: 14px;
    height: 14px;
    font-size: 0.6rem;
    top: -3px;
    right: -3px;
  }
`;