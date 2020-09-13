/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { HeaderProps } from '../../@types';

import logo from '../../assets/s1cket.svg';
import bitcoin from '../../assets/bitcoin.svg';
import home from '../../assets/home.svg';
import wallet from '../../assets/wallet.svg';
import currency from '../../assets/currency.svg';
import './styles.css';

const Header: React.FC<HeaderProps> = ({ name, hasFavorites, activePage }) => {
  const [opened, setOpened] = useState(false);

  function handleToggleNavigatorState() {
    document.body.classList.toggle('blocked', !opened);
    setOpened(!opened);
  }
  return (
    <header id="header" className={opened ? `${name} up` : name}>
      <div className="header-box">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo s1cket" />
          </Link>
        </div>
        {hasFavorites && (
          <div className="favorites">
            <Link
              to={{
                pathname: '/favorites',
                search: `search=${activePage.toLowerCase()}`,
              }}
            >
              Ver Favoritos
            </Link>
          </div>
        )}
        <nav className={opened ? 'menu opened' : 'menu'}>
          <ul>
            <li>
              <Link to="/" className={activePage === 'Home' ? 'active' : ''}>
                <img src={home} alt="Home" />
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/exchange"
                className={activePage === 'Exchange' ? 'active' : ''}
              >
                <img src={currency} alt="Currency" />
                Câmbio
              </Link>
            </li>
            <li>
              <Link
                to="/stocks"
                className={activePage === 'Stocks' ? 'active' : ''}
              >
                <img src={wallet} alt="Wallet" />
                Ações
              </Link>
            </li>
            <li>
              <Link
                to="/crypto"
                className={activePage === 'Crypto' ? 'active' : ''}
              >
                <img src={bitcoin} alt="Bitcoin" />
                Cripto
              </Link>
            </li>
          </ul>
          <div id="burger" onClick={handleToggleNavigatorState}>
            <i />
            <i />
            <i />
            <div className="modal">
              <ul className="menu-burger">
                <li>
                  <Link
                    to="/"
                    className={activePage === 'Home' ? 'active' : ''}
                  >
                    <img src={home} alt="Home" />
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/exchange"
                    className={activePage === 'Exchange' ? 'active' : ''}
                  >
                    <img src={currency} alt="Currency" />
                    Câmbio
                  </Link>
                </li>
                <li>
                  <Link
                    to="/stocks"
                    className={activePage === 'Stocks' ? 'active' : ''}
                  >
                    <img src={wallet} alt="Wallet" />
                    Ações
                  </Link>
                </li>
                <li>
                  <Link
                    to="/crypto"
                    className={activePage === 'Crypto' ? 'active' : ''}
                  >
                    <img src={bitcoin} alt="Bitcoin" />
                    Cripto
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
