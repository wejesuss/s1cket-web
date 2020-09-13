/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';

import { Favorites, FavoritesData, HeartProps } from '../../@types';

import heartIcon from '../../assets/heart.svg';
import heartFullIcon from '../../assets/heart-full.svg';
import './styles.css';

const Heart: React.FC<HeartProps> = ({
  action,
  stocksData,
  cryptoData,
  exchangeData,
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const favoriteData = {
    ...stocksData,
    ...cryptoData,
    ...exchangeData,
  };

  function toggleAddRemoveFavorites(
    data: FavoritesData,
    oldFavorites: Favorites,
  ) {
    const index = oldFavorites.findIndex((favorite) => favorite.id === data.id);
    let wasRemoved = false;

    if (index !== -1) {
      oldFavorites.splice(index, 1);
      wasRemoved = true;
    } else {
      oldFavorites.push({ ...data });
    }

    setIsFavorited(!wasRemoved);
    return oldFavorites;
  }

  function handleSetFavorites(data: FavoritesData) {
    const favorites = localStorage.getItem(`favorites-${action}`);

    if (favorites) {
      let oldFavorites: Favorites = JSON.parse(favorites);

      oldFavorites = toggleAddRemoveFavorites(data, oldFavorites);

      localStorage.setItem(`favorites-${action}`, JSON.stringify(oldFavorites));
    } else {
      localStorage.setItem(
        `favorites-${action}`,
        JSON.stringify([{ ...data }]),
      );
      setIsFavorited(true);
    }
  }

  function handleToggleFavorites() {
    handleSetFavorites(favoriteData as FavoritesData);
  }

  useEffect(() => {
    const favorites: Favorites = JSON.parse(
      localStorage.getItem(`favorites-${action}`) || '[]',
    );

    const index = favorites.findIndex(
      (favorite) => favorite.id === (favoriteData as FavoritesData).id,
    );

    setIsFavorited(false);

    if (index !== -1) {
      setIsFavorited(true);
    }
  }, [action, favoriteData]);

  return (
    <span className="favorite" onClick={handleToggleFavorites}>
      {isFavorited ? (
        <img src={heartFullIcon} alt="Favorited" />
      ) : (
        <img src={heartIcon} alt="Favorite" />
      )}
    </span>
  );
};

export default Heart;
