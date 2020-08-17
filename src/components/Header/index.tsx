import React from 'react';
import { Link } from 'react-router-dom';

import './styles.css';
import logo from '../../assets/s1cket.svg';
import bitcoin from '../../assets/bitcoin.svg';
import home from '../../assets/home.svg';
import wallet from '../../assets/wallet.svg';

interface HeaderProps {
  name: string;
  activePage: string;
  hasFavorites?: boolean;
}

// eslint-disable-next-line react/prop-types
const Header: React.FC<HeaderProps> = ({ name, hasFavorites, activePage }) => {
  return (
    <header id="header" className={name}>
      <div className="header-box">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo s1cket" />
          </Link>
        </div>
        {hasFavorites && (
          <div className="favorites">
            <Link to="/favorites?type=stock">Ver Favoritos</Link>
          </div>
        )}
        <nav className="menu">
          <ul>
            <li>
              <Link to="/" className={activePage === 'Home' ? 'active' : ''}>
                <img src={home} alt="Home" />
                Home
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
                to="/cripto"
                className={activePage === 'Bitcoin' ? 'active' : ''}
              >
                <img src={bitcoin} alt="Bitcoin" />
                Cripto
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
