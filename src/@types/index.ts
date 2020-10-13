/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/ban-types */
import { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import {
  PolishedCryptoSeriesData,
  PolishedExchangeRate,
  PolishedInformations,
  PolishedIntradayDailyAndWeekly,
} from '../services/api-types';

export interface HeaderProps {
  name: string;
  activePage: string;
  hasFavorites?: boolean;
}

export interface StockArticleProps {
  symbol: string;
  currency: string;
  name: string;
  region: string;
  type: string;
  seriesActionIntraday: Function;
  seriesActionDaily: Function;
  seriesActionWeekly: Function;
}

export interface StocksArticleProps {
  symbol: string;
  currency: string;
  name: string;
  region: string;
  type: string;
}

export interface CryptoArticleProps {
  symbol: string;
  name: string;
  currency: string;
  currencyName: string;
  seriesActionDaily: Function;
  seriesActionWeekly: Function;
  seriesActionMonthly: Function;
}

export interface ExchangeArticleProps {
  fromCurrencyCode: string;
  fromCurrencyName: string;
  toCurrencyCode: string;
  toCurrencyName: string;
  exchangeRate: string;
  bidPrice: string;
  askPrice: string;
  updateExchangeRate?: Function;
}

export interface IsResultsEmpty {
  byName: boolean;
  bySymbol: boolean;
}

export interface ExchangeRateForm {
  from: string;
  to: string;
}

export interface ExchangeRateData {
  exchangeRate?: PolishedExchangeRate;
  form: ExchangeRateForm;
  isResultsEmpty: boolean;
  updateExchangeRate(fromC: string, toC: string): void;
  updateForm({ from, to }: Partial<ExchangeRateForm>): void;
}

export type CandleStickPolished = {
  x: Date;
  y: number[];
}[];

export type BarPolished = {
  x: Date;
  y: number;
}[];

export type PolishedSeries = CandleStickPolished | BarPolished;
export type CryptoSeries = Record<string, PolishedCryptoSeriesData | undefined>;
export type StockSeries = Record<
  string,
  Record<PolishedInformations, string> | undefined
>;

export interface ChartProps {
  stockSeries?: StockSeries;
  cryptoSeries?: CryptoSeries;
  currencyCode?: string;
  type: 'bar' | 'candlestick';
  name?: string;
  id?: string;
  titleBar?: string;
  titleCandle?: string;
  division?: number;
  height?: number | string;
  width?: number | string;
}

export interface StocksProps {
  id: string;
  currency: string;
  name: string;
  region: string;
  symbol: string;
  type: string;
}

export interface CryptoProps {
  id: string;
  symbol: string;
  name: string;
  currency: string;
  currencyName: string;
}

export interface ExchangeProps {
  id: string;
  fromCurrencyCode: string;
  fromCurrencyName: string;
  toCurrencyCode: string;
  toCurrencyName: string;
  exchangeRate: string;
  bidPrice: string;
  askPrice: string;
}

export interface HeartProps {
  action: 'stocks' | 'crypto' | 'exchange';
  stocksData?: StocksProps;
  cryptoData?: CryptoProps;
  exchangeData?: ExchangeProps;
}

export interface DataListProps {
  unified?: boolean;
}

export type FavoritesData = StocksProps | CryptoProps | ExchangeProps;

type Mapped<T> = {
  [P in keyof T]: T[P];
}[];

export type Favorites = Mapped<FavoritesData>;

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  upLabel: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  options: { label: string; value: string }[];
}
