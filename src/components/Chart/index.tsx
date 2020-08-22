import React, { useState, useEffect } from 'react';
import * as ApexChart from 'react-apexcharts';
import pt_BR from "apexcharts/dist/locales/pt-br.json";

import { PolishedInformations } from '../../services/api-types';

type CandleStickPolished = {
  x: Date;
  y: number[];
}[]

type BarPolished = {
  x: Date;
  y: number;
}[]

type PolishedSeries = CandleStickPolished | BarPolished;

interface ChartProps {
  series: Record<string, Record<PolishedInformations, string> | undefined> | undefined;
  type: "bar" | "candlestick";
  name?: string;
  titleBar?: string;
  division?: number;
  height?: number | string;
  width?: number | string;
}

const Chart: React.FC<ChartProps> = ({ series, type, name = 'volume', titleBar = 'Volume (M)', division = 1000000, height = 350, width = "90%" }) => {
  const [seriesPolished, setSeriesPolished] = useState([
    name ? { name, data: [] as PolishedSeries} : { data: [] as PolishedSeries },
  ]);
  const [options] = useState({
    chart: {
      id: 'candles',
      toolbar: {
        autoSelected: 'pan',
        show: true
      },
      zoom: {
        enabled: false
      },
      locales: [pt_BR],
      defaultLocale: 'pt-br'
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
        target: 'candles',
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
    const newTimeSeriesBar = [] as BarPolished;
    if(series) {
      const newTimeSeries = Object.entries(series).reduceRight((newTimeSeries, series) => {
        const x = new Date(series[0]);
        newTimeSeries.push({
          x,
          y: [Number(series?.[1]?.['open']), Number(series?.[1]?.['high']), Number(series?.[1]?.['low']), Number(series?.[1]?.['close'])]
        });

        newTimeSeriesBar.push({
          x,
          y: Number(series?.[1]?.['volume'])
        });

        return newTimeSeries
      }, [] as CandleStickPolished);

      const newSeries = seriesPolished
      .filter(serie =>
        !(serie?.data && Array.isArray(serie.data))
      );

      if(type === "bar") {
        newSeries.push({ name, data: newTimeSeriesBar });
      } else {
        newSeries.push({ data: newTimeSeries });
      }

      setSeriesPolished(newSeries)
    }
  }

  useEffect(setData, [series])

  return (
    <>
      {series && (
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
