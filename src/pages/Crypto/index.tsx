import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Chart from '../../components/Chart';
import Heart from '../../components/Heart';
import Header from '../../components/Header';
import CryptoFormSearch from '../../components/CryptoFormSearch';

import { waitTwoMinutes } from '../../helpers';
import { useCrypto } from '../../hooks/useCrypto';

import './styles.css';

const Crypto: React.FC = () => {
  const history = useHistory();
  const {
    code,
    form: { market, search, series },
    isResultsEmpty,
    resultsBySymbol,
    updateForm,
    searchBySymbol,
  } = useCrypto();

  function searchWithFavorites(
    incomingSeries?: string,
    incomingSymbol?: string,
    incomingMarket?: string,
  ) {
    const seriesToSearch = incomingSeries || series;
    const symbolToSearch = incomingSymbol || search;
    const marketToSearch = incomingMarket || market;

    updateForm({
      market: marketToSearch,
      search: symbolToSearch,
      series: seriesToSearch,
    });

    if (!waitTwoMinutes()) {
      alert('Espere dois minutos para pesquisar de novo');
      return;
    }

    searchBySymbol(symbolToSearch, seriesToSearch, marketToSearch);
  }

  useEffect(() => {
    const { state } = history.location;

    if (state) {
      const {
        series: incomingSeries,
        symbol: incomingSymbol,
        market: incomingMarket,
      } = state as { series?: string; symbol?: string; market?: string };

      searchWithFavorites(incomingSeries, incomingSymbol, incomingMarket);
    }
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <Header name="crypto" activePage="Crypto" hasFavorites />

      <div id="crypto">
        <CryptoFormSearch />
        <main>
          {resultsBySymbol?.data?.information && (
            <>
              <h1 className="results-title">
                Informações sobre
                {'  '}
                {resultsBySymbol?.data?.digitalCurrencyName}
              </h1>

              <div className="information">
                <table>
                  <caption>{resultsBySymbol.data.information}</caption>
                  <thead>
                    <tr className="heart-icon">
                      <td>
                        <Heart
                          action="crypto"
                          cryptoData={{
                            id: (
                              resultsBySymbol.data.digitalCurrencyCode +
                              resultsBySymbol.data.marketCode
                            ).toUpperCase(),
                            symbol: resultsBySymbol.data.digitalCurrencyCode,
                            name: resultsBySymbol.data.digitalCurrencyName,
                            currency: resultsBySymbol.data.marketCode,
                            currencyName: resultsBySymbol.data.marketName,
                          }}
                        />
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>Última Atualização:</th>
                      <td>{resultsBySymbol.data.lastRefreshed}</td>
                    </tr>

                    <tr>
                      <th>De:</th>
                      <td>{resultsBySymbol.data.digitalCurrencyCode}</td>
                    </tr>

                    <tr>
                      <th>Para:</th>
                      <td>{resultsBySymbol.data.marketCode}</td>
                    </tr>

                    <tr>
                      <th>Fuso Horário:</th>
                      <td>{resultsBySymbol.data.timeZone}</td>
                    </tr>
                  </tbody>
                </table>

                {resultsBySymbol && (
                  <div className="chart">
                    {code !== 'USD' && (
                      <Chart
                        cryptoSeries={resultsBySymbol.timeSeries}
                        currencyCode={code}
                        titleCandle={code}
                        height={200}
                        type="candlestick"
                        id={code}
                      />
                    )}

                    <Chart
                      cryptoSeries={resultsBySymbol.timeSeries}
                      titleCandle="USD"
                      height={200}
                      type="candlestick"
                    />

                    <Chart
                      cryptoSeries={resultsBySymbol.timeSeries}
                      type="bar"
                      name="volume"
                      height={200}
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {isResultsEmpty ? (
            <p className="no-results">Nenhum resultado encontrado</p>
          ) : null}
        </main>
      </div>
    </>
  );
};

export default Crypto;
