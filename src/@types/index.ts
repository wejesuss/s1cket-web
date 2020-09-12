import { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { PolishedCryptoSeriesData, PolishedInformations, PolishedIntradayDailyAndWeekly, PolishedSearch } from "../services/api-types";

export interface HeaderProps {
  name: string;
  activePage: string;
  hasFavorites?: boolean;
};

export interface StockBySymbolProps {
  series: string;
  intervalTime: string;
  outputSize: string;
  setSeries: React.Dispatch<React.SetStateAction<string>>;
  setIntervalTime: React.Dispatch<React.SetStateAction<string>>;
  setOutputSize: React.Dispatch<React.SetStateAction<string>>;
};

export interface StockArticleProps {
  symbol: string;
  currency: string;
  name: string;
  region: string;
  type: string;
  seriesActionIntraday: Function;
  seriesActionDaily: Function;
  seriesActionWeekly: Function;
};

export interface StocksArticleProps {
  setResultsBySymbol: React.Dispatch<React.SetStateAction<PolishedIntradayDailyAndWeekly | undefined>>;
  setIsResultsEmpty: React.Dispatch<React.SetStateAction<IsResultsEmpty>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setSeries: React.Dispatch<React.SetStateAction<string>>;
  setType: React.Dispatch<React.SetStateAction<string>>;
  symbol: string;
  currency: string;
  name: string;
  region: string;
  type: string;
  intervalTime: string;
  outputSize: string;
  isResultsEmpty: IsResultsEmpty;
};

export interface CryptoArticleProps {
  symbol: string;
  name: string;
  currency: string;
  currencyName: string;
  seriesActionDaily: Function;
  seriesActionWeekly: Function;
  seriesActionMonthly: Function;
};

export interface ExchangeArticleProps {
  fromCurrencyCode: string;
  fromCurrencyName: string;
  toCurrencyCode: string;
  toCurrencyName: string;
  exchangeRate: string;
  bidPrice: string;
  askPrice: string;
  updateExchangeRate?: Function;
};

export interface IsResultsEmpty {
  byName: boolean;
  bySymbol: boolean;
};

export interface StocksFormSearchProps {
  setType: React.Dispatch<React.SetStateAction<string>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setSeries: React.Dispatch<React.SetStateAction<string>>;
  setIntervalTime: React.Dispatch<React.SetStateAction<string>>;
  setOutputSize: React.Dispatch<React.SetStateAction<string>>;
  setResultsByName: React.Dispatch<React.SetStateAction<PolishedSearch>>;
  setIsResultsEmpty: React.Dispatch<React.SetStateAction<IsResultsEmpty>>;
  type: string;
  search: string;
  series: string;
  intervalTime: string;
  outputSize: string;
  isResultsEmpty: IsResultsEmpty;
  searchBySymbol: Function;
};

export interface CryptoFormSearchProps {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setMarket: React.Dispatch<React.SetStateAction<string>>;
  setSeries: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  market: string;
  series: string;
  searchBySymbol: Function;
};

export interface ExchangeFormSearchProps {
  setFromCurrency: React.Dispatch<React.SetStateAction<string>>;
  setToCurrency: React.Dispatch<React.SetStateAction<string>>;
  from_currency: string;
  to_currency: string;
  searchExchangeRate: Function;
};

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
export type StockSeries = Record<string, Record<PolishedInformations, string> | undefined>;

export interface ChartProps {
  stockSeries?: StockSeries;
  cryptoSeries?: CryptoSeries;
  currencyCode?: string;
  type: "bar" | "candlestick";
  name?: string;
  id?: string;
  titleBar?: string;
  titleCandle?: string;
  division?: number;
  height?: number | string;
  width?: number | string;
};

export interface StocksProps {
  id: string;
  currency: string;
  name: string;
  region: string;
  symbol: string;
  type: string;
};

export interface CryptoProps {
  id: string;
  symbol: string;
  name: string;
  currency: string;
  currencyName: string;
};

export interface ExchangeProps {
  id: string;
  fromCurrencyCode: string;
  fromCurrencyName: string;
  toCurrencyCode: string;
  toCurrencyName: string;
  exchangeRate: string;
  bidPrice: string;
  askPrice: string;
};

export interface HeartProps {
  action: "stocks" | "crypto" | "exchange";
  stocksData?: StocksProps;
  cryptoData?: CryptoProps;
  exchangeData?: ExchangeProps;
};

export type FavoritesData = StocksProps |CryptoProps | ExchangeProps;

type Mapped<T> = {
  [P in keyof T]: T[P]
}[];

export type Favorites = Mapped<FavoritesData>;

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  upLabel: string;
  label: string;
};

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  options: { label: string; value: string }[];
};
