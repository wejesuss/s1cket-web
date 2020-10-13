import { useContext } from 'react';
import { CryptoContext } from '../contexts/crypto';
import { CryptoData } from '../@types';

function useCrypto(): CryptoData {
  const context = useContext(CryptoContext);

  if (!context) {
    throw new Error('useCrypto must be within a CryptoProvider');
  }

  return context;
}

export { useCrypto };
