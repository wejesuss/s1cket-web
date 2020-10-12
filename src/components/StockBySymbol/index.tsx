import React from 'react';

import { useStocks } from '../../hooks/useStocks';

import Select from '../Select';

const StockBySymbol: React.FC = () => {
  const {
    form: { intervalTime, outputSize, series },
    updateForm,
  } = useStocks();

  return (
    <>
      <Select
        name="series"
        label="Série Temporal"
        value={series}
        onChange={(e) => updateForm({ series: e.target.value })}
        options={[
          { label: 'Intraday', value: 'intraday' },
          { label: 'Daily', value: 'daily' },
          { label: 'Weekly', value: 'weekly' },
        ]}
      />

      {series === 'intraday' && (
        <Select
          name="interval"
          label="Intervalo"
          value={intervalTime}
          onChange={(e) => updateForm({ intervalTime: e.target.value })}
          options={[
            { label: '1 Min', value: '1min' },
            { label: '5 Min', value: '5min' },
            { label: '15 Min', value: '15min' },
            { label: '30 Min', value: '30min' },
            { label: '60 Min', value: '60min' },
          ]}
        />
      )}

      {(series === 'intraday' || series === 'daily') && (
        <Select
          name="output"
          value={outputSize}
          onChange={(e) => updateForm({ outputSize: e.target.value })}
          options={[
            { label: 'Compacto', value: 'compact' },
            { label: 'Completo', value: 'full' },
          ]}
          label="Saída"
        />
      )}
    </>
  );
};

export default StockBySymbol;
