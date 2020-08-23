import React, { useState, useEffect } from 'react';

import heartIcon from '../../assets/heart.svg';
import heartFullIcon from '../../assets/heart-full.svg';
import './styles.css';

interface HeartProps {
  symbol: string;
  currency: string;
  name: string;
  region: string;
  type: string;
}

export interface FavoritesData {
  name: string;
  currency: string;
  region: string;
  type: string;
}

export interface Favorites extends FavoritesData {
  symbol: string;
}

const Heart: React.FC<HeartProps> = ({ symbol, currency, name, region, type }) => {
  const [isFavorited, setIsFavorited] = useState(false)

  function handleSetFavorites(
    symbol: string,
    data: FavoritesData = { currency: '', name: '', region: '', type: '' }
  ): boolean {
    let dataIsInvalid = false;
    const dataKeys = Object.keys(data);
    if(dataKeys.length < 1) dataIsInvalid = true;
    dataKeys.forEach((key) => {
      if(!data[key as "currency" | "region" | "name" | 'type']) dataIsInvalid = true
    });

    if(dataIsInvalid) {
      return false
    }

    let wasRemoved = false;
    let favorites = localStorage.getItem("favorites-stocks")
    if(favorites) {
      let oldFavorites: Favorites[] = JSON.parse(favorites);
      const index = oldFavorites.findIndex(favorited => favorited.symbol === symbol);

      if(index !== -1) {
        oldFavorites.splice(index, 1);
        wasRemoved = true
      } else {
        oldFavorites.push({...data, symbol});
      }

      localStorage.setItem("favorites-stocks", JSON.stringify(oldFavorites));
    } else {
      localStorage.setItem("favorites-stocks", JSON.stringify([{...data, symbol}]))
    }

    return wasRemoved;
  }

  useEffect(() => {
    const favorites: Favorites[] = JSON.parse(localStorage.getItem("favorites-stocks") || '[]')
    const index = favorites.findIndex(favorite => favorite.symbol === symbol)

    if(index !== -1) {
      setIsFavorited(true)
    }
  }, [symbol])

  return (
    <span
      className="favorite"
      onClick={() => {
        const wasRemoved = handleSetFavorites(symbol, {
          currency,
          name,
          region,
          type
        });

        setIsFavorited(!wasRemoved)
      }}
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
