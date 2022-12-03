import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProgressBar from './progressBar';
import fetchWrapper from './ui-helpers/fetch';
import TransactionRender from './transactionRender';
import log from '../helpers/logger';

export default function TokenDetailsTrades(props) {
  const [data, setData] = useState({
    trades: [],
    stats: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  async function getTrades() {
    const url = `http://localhost:3000/api/trades?tokenId=${props.tokenId}`;
    const txs = await fetchWrapper(url);

    if (!txs.hasOwnProperty('error')) {
      setData(txs);
      //setPage(page + 1);
      //setIsFetching(false);
    } else if (txs.hasOwnProperty('error')) {
      //setLoadedAll(true);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    getTrades();
  }, []);

  log('data', data);

  const renderTransactions = () => {
    const items = [];

    for (let i = 0; i < data.trades.length; i++) {
      items.push(<TransactionRender tokenInfo={props.tokenInfo} transaction={data.trades[i]} key={`token-transactions-${props.tokenId}-${i}`} />);
    }

    return items;
  };

  return (
    <>
      <section>
        {!isLoading && data.trades.length > 0 &&
          <>
            <div className="trades-stats-block text-right" style={{paddingBottom: '10px'}}>
              <h4>Total volume: {data.stats.volume} {props.tokenInfo.name}</h4>
              <h4>Total trades: {data.stats.count}</h4>
            </div>
            {renderTransactions()}
          </>
        }
        {isLoading && 
          <ProgressBar />
        }
        {!isLoading && !data.trades.length &&
          <div className="alert alert-warning">No trades history.</div>
        }
      </section>
    </>
  );
}