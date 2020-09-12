import React, { useState, useEffect } from 'react';
import * as ApexChart from 'react-apexcharts';
import pt_BR from "apexcharts/dist/locales/pt-br.json";
import { BarPolished, CandleStickPolished, ChartProps, CryptoSeries, PolishedSeries, StockSeries } from '../../@types';

const Chart: React.FC<ChartProps> = ({ stockSeries, cryptoSeries, currencyCode = "USD", type, name, id = "candles", titleCandle = '', titleBar = 'Volume (Mil)', division = 1000, height = 350, width = "90%" }) => {
  const [seriesPolished, setSeriesPolished] = useState([
    name ? { name, data: [] as PolishedSeries} : { data: [] as PolishedSeries },
  ]);
  const [options, setOptions] = useState({
    chart: {
      id,
      toolbar: {
        autoSelected: 'pan',
        show: true
      },
      zoom: {
        enabled: id !== 'candles'
      },
      locales: [pt_BR],
      defaultLocale: 'pt-br'
    },
    title: {
      text: titleCandle,
      align: 'center',
      offsetY: 16,
      style: {
        fontSize: '18px',
        fontFamily: 'Roboto'
      }
    },
    xaxis: {
      type: "datetime",
      labels: {
        show: false
      }
    }
  });
  const [optionsBar] = useState({
    chart: {
      id: name,
      brush: {
        enabled: true,
        target: id,
      },
      toolbar: {
        autoSelected: 'selection',
        show: true
      },
      zoom: {
        enabled: true
      },
      selection: {
        enabled: true,
        xaxis: {
          min: seriesPolished[0]?.data[0]?.x?.getTime(),
          max: seriesPolished[0]?.data[seriesPolished[0]?.data?.length - 1]?.x?.getTime()
        },
        fill: {
          color: '#ccc',
          opacity: 0.4
        },
        stroke: {
          color: '#0d47a1'
        }
      },
      locales: [pt_BR],
      defaultLocale: 'pt-br'
    },
    title: {
      text: titleBar,
      align: 'center',
      offsetY: 16,
      style: {
        fontSize: '18px',
        fontFamily: 'Roboto'
      }
    },
    tooltip: {
      enabled: true,
    },
    plotOptions: {
      bar: {
        columnWidth: '80%',
        colors: {
          ranges: [
            {
              from: -1000000000,
              to: 0,
              color: '#F15B46'
            },
            {
              from: 1,
              to: 1000000000,
              color: '#FEB019'
            }
          ]
        }
      },
    },
    stroke: {
      width: .1
    },
    xaxis: {
      type: "datetime",
      axisBorder: {
        offsetX: 13
      }
    },
    yaxis: {
      labels: {
        formatter: function(value: string) {
          return (Number(value) / division);
        }
      }
    },
    dataLabels: {
      enabled: false
    },

  });

  function setData() {
    if(stockSeries) {
      getStockOHLCValues(stockSeries);
    }

    if(cryptoSeries) {
      getCryptoOHLCValues(cryptoSeries);
      setOptions(options => {
        return {
          ...options,
          title: {
            ...options.title,
            text: titleCandle
          }
        }
      });
    }
  }

  function getStockOHLCValues(series: StockSeries) {
    const newTimeSeriesBar = [] as BarPolished;
    const isOfTypeBar = type === "bar";
    const newTimeSeries = Object.entries(series).reduceRight((newTimeSeries, series) => {
      const x = new Date(series[0]);

      if(!isOfTypeBar) {
        newTimeSeries.push({
          x,
          y: [Number(series?.[1]?.['open']), Number(series?.[1]?.['high']), Number(series?.[1]?.['low']), Number(series?.[1]?.['close'])]
        });
      } else {
        newTimeSeriesBar.push({
          x,
          y: Number(series?.[1]?.['volume'])
        });
      }

      return newTimeSeries
    }, [] as CandleStickPolished);

    const newSeries = seriesPolished
    .filter(serie =>
      !(serie?.data && Array.isArray(serie.data))
    );

    if(isOfTypeBar) {
      newSeries.push({ name, data: newTimeSeriesBar });
    } else {
      newSeries.push({ data: newTimeSeries });
    }

    setSeriesPolished(newSeries)
  }

  function getCryptoOHLCValues(series: CryptoSeries) {
    const newTimeSeriesBar = [] as BarPolished;
    const isOfTypeBar = type === "bar";
    const newTimeSeries = Object.entries(series).reduceRight((newTimeSeries, series) => {
      const x = new Date(series[0]);

      if(!isOfTypeBar) {
        newTimeSeries.push({
          x,
          y: [
            Number(series?.[1]?.[`open${currencyCode}`]),
            Number(series?.[1]?.[`high${currencyCode}`]),
            Number(series?.[1]?.[`low${currencyCode}`]),
            Number(series?.[1]?.[`close${currencyCode}`])
          ]
        });
      } else {
        newTimeSeriesBar.push({
          x,
          y: Number(series?.[1]?.['volume'])
        });
      }

      return newTimeSeries
    }, [] as CandleStickPolished);

    const newSeries = seriesPolished
    .filter(serie =>
      !(serie?.data && Array.isArray(serie.data))
    );

    if(isOfTypeBar) {
      newSeries.push({ name, data: newTimeSeriesBar });
    } else {
      newSeries.push({ data: newTimeSeries });
    }

    setSeriesPolished(newSeries)
  }

  useEffect(setData, [stockSeries, cryptoSeries])

  return (
    <>
      {(stockSeries || cryptoSeries) && (
        (type === "candlestick" ? (
          <div className="chart-prices">
            <ApexChart.default type="candlestick" height={height} width={width} options={options} series={seriesPolished} />
          </div>
        ) : (
          <div className="chart-volume">
            <ApexChart.default type="bar" height={height} width={width} options={optionsBar} series={seriesPolished} />
          </div>
        ))
      )}
    </>
  );
};

export default Chart;
