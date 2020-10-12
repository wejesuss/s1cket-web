import { useContext } from 'react';
import { StocksContext, StocksData } from '../contexts/stocks';

function useStocks(): StocksData {
  const context = useContext(StocksContext);

  if (!context) {
    throw new Error('useStocks must be within a StocksProvider');
  }

  return context;
}

export { useStocks };
