import { useContext } from 'react';
import { CryptoContext, CryptoData } from '../contexts/crypto';

function useCrypto(): CryptoData {
  const context = useContext(CryptoContext);

  if (!context) {
    throw new Error('useCrypto must be within a CryptoProvider');
  }

  return context;
}

export { useCrypto };
