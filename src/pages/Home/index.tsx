import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';

import './styles.css';

const Home: React.FC = () => {
  return (
    <>
      <Header name="home" activePage="Home" />

      <main id="landing">
        <section className="investing">
          <h1>
            <>Sua vida </>
            <strong>financeira </strong>
            da maneira
            <br />
            que você
            <>
              <strong> sempre sonhou!</strong>
            </>
          </h1>
        </section>

        <section className="start-now">
          <h4>Você, no controle dos seus investimentos!</h4>
          <Link to="/stocks">Começar Agora</Link>
        </section>
      </main>
    </>
  );
};

export default Home;
