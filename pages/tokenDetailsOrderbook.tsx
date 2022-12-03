import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProgressBar from './progressBar';
import fetchWrapper from './ui-helpers/fetch';
import log from '../helpers/logger';

export default function TokenDetailsOrderbook(props) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getOrderbook() {
    const url = `http://localhost:3000/api/orders?tokenId=${props.tokenId}`;
    const orderbook = await fetchWrapper(url);

    if (!orderbook.hasOwnProperty('error')) {
      setData(data.concat(orderbook));
      //setPage(page + 1);
      //setIsFetching(false);
    } else if (orderbook.hasOwnProperty('error')) {
      //setLoadedAll(true);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    getOrderbook();
  }, []);

  log('data', data);

  const renderOrderbook = () => {
    const items = [];

    for (let i = 0; i < data.length; i++) {
      items.push(
        <tr className="fader" key={`token-details-orderbook-${i}`}>
          <td>{data[i].funcid === 's' ? 'Sell' : 'Buy'}</td>
          <td>{data[i].funcid === 's' ? data[i].askamount : data[i].totalrequired}</td>
          <td>{data[i].price} TKL</td>
        </tr>
      );
    }

    return items;
  };

  return (
    <>
      <section>
        {!isLoading && data.length > 0 &&
          <div className="row">
            <div className="col-xs-12 col-md-12">
              <table className="table table-hover table-striped">
                <thead>
                  <tr>
                    <th>Direction</th>
                    <th>Amount</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {renderOrderbook()}
                  {isLoading &&
                    <tr>
                      <td colSpan={5}><ProgressBar /></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
        {isLoading && 
          <ProgressBar />
        }
        {!isLoading && !data.length &&
          <div className="alert alert-warning">No orders.</div>
        }
      </section>
    </>
  );
}