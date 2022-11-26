import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProgressBar from './progressBar';
import fetchWrapper from './ui-helpers/fetch';
import TransactionRender from './transactionRender';
import log from '../helpers/logger';

export default function TokenDetailsTransactions(props) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getTransactions() {
    const url = `http://localhost:3000/api/transactions?tokenId=${props.tokenId}`;
    const txs = await fetchWrapper(url);

    if (!txs.hasOwnProperty('error')) {
      setData(data.concat(txs));
      //setPage(page + 1);
      //setIsFetching(false);
    } else if (txs.hasOwnProperty('error')) {
      //setLoadedAll(true);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    getTransactions();
  }, []);

  log('data', data);

  const renderTransactions = () => {
    const items = [];

    for (let i = 0; i < data.length; i++) {
      items.push(<TransactionRender tokenInfo={props.tokenInfo} transaction={data[i]} key={`token-transactions-${props.tokenId}-${i}`} />);
    }

    return items;
  };

  return (
    <>
      <section>
        {!isLoading && data.length > 0 &&
          <>{renderTransactions()}</>
        }
        {isLoading && 
          <ProgressBar />
        }
        {!isLoading && !data.length &&
          <div className="alert alert-warning">No transactions history.</div>
        }
      </section>
    </>
  );
}