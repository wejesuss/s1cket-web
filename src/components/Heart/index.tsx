import React, { useState, useEffect } from 'react';

import heartIcon from '../../assets/heart.svg';
import heartFullIcon from '../../assets/heart-full.svg';
import './styles.css';

interface HeartProps {
  action: 'stocks' | 'crypto';
  symbol: string;
  name: string;
  currency: string;
  currencyName?: string;
  region?: string;
  type?: string;
}

export interface FavoritesData {
  name: string;
  currency: string;
  currencyName?: string;
  region?: string;
  type?: string;
}

export interface Favorites extends FavoritesData {
  symbol: string;
}

const Heart: React.FC<HeartProps> = ({ action, symbol, currency, currencyName, name, region = "United States", type = "Equity" }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  function handleSetFavorites(
    symbol: string,
    data: FavoritesData
  ): boolean {
    let wasRemoved = false;
    let favorites = localStorage.getItem(`favorites-${action}`)
    if(favorites) {
      let oldFavorites: Favorites[] = JSON.parse(favorites);
      const index = oldFavorites.findIndex(favorited => {
        if(currencyName && favorited.currencyName) {
          return (favorited.symbol + favorited.currencyName) === (symbol + currencyName);
        }

        return favorited.symbol === symbol;
      });

      if(index !== -1) {
        oldFavorites.splice(index, 1);
        wasRemoved = true
      } else {
        oldFavorites.push({...data, symbol});
      }

      localStorage.setItem(`favorites-${action}`, JSON.stringify(oldFavorites));
    } else {
      localStorage.setItem(`favorites-${action}`, JSON.stringify([{...data, symbol}]))
    }

    return wasRemoved;
  }

  function handleToggleFavorites() {
    let favoriteData: FavoritesData = {
      currency,
      name,
      currencyName
    }

    if(action === "stocks") {
      favoriteData = {
        ...favoriteData,
        region,
        type
      }
    }

    const wasRemoved = handleSetFavorites(symbol, favoriteData);
    setIsFavorited(!wasRemoved)
  }

  useEffect(() => {
    const favorites: Favorites[] = JSON.parse(localStorage.getItem(`favorites-${action}`) || '[]')
    const index = favorites.findIndex(favorited => {
      if(currencyName && favorited.currencyName) {
        return (favorited.symbol + favorited.currency) === (symbol + currency);
      }

      return favorited.symbol === symbol;
    })

    if(index !== -1) {
      setIsFavorited(true)
    } else {
      setIsFavorited(false)
    }
  }, [symbol, action, currencyName, currency])

  return (
    <span
      className="favorite"
      onClick={handleToggleFavorites}
    >
      {isFavorited ? (
        <img src={heartFullIcon} alt="Favorited" />
      ) : (
        <img src={heartIcon} alt="Favorite" />
      )}
    </span>
  );
};

export default Heart;
