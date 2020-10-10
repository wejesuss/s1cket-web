import { useContext } from 'react';
import { ExchangeRateData } from '../@types';
import { ExchangeRate } from '../contexts/exchangeRate';

function useExchangeRate(): ExchangeRateData {
  const context = useContext(ExchangeRate);

  if (!context) {
    throw new Error('useExchangeRate must be within a ExchangeRateProvider');
  }

  return context;
}

export { useExchangeRate };
