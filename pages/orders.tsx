
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Main from './main';
import useInfiniteScroll from './ui-helpers/infiniteScroll';
import fetchWrapper from './ui-helpers/fetch';
import ProgressBar from './progressBar';
import log from '../helpers/logger';
import serverUrl from '../helpers/endpoint';

export default function OrdersList(props) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(Number(props.page) || 1);
  const [loadedAll, setLoadedAll] = useState(false);
  const [isFetching, setIsFetching] = useInfiniteScroll(moreData);

  async function moreData() {
    if (!loadedAll) {
      const url = `${serverUrl}/orders?page=${page + 1}`;
      const newData = await fetchWrapper(url);

      if (!newData.hasOwnProperty('error')) {
        setData(data.concat(newData));
        setPage(page + 1);
        setIsFetching(false);
      } else if (newData.hasOwnProperty('error') && newData.error === 'no orders') {
        setLoadedAll(true);
      }
    }
  }

  useEffect(() => {
    setData(props.orders);
  }, []);

  const renderOrdersList = () => {
    const items = [];
    
    for (let i = 0; i < data.length; i++) {
      items.push(
        <tr className="fader" key={`token-list-item-${i}`}>
          <td>
          <Link href={`${`token-details?tokenId=${data[i].tokenid}`}`}><a>{data[i].tokenInfo.name}</a></Link><br/>
            {/*<small className="token-list-description">{data[i].description}</small>*/}
          </td>
          <td>{data[i].tokenInfo.supply > 1 ? 'Fixed' : 'NFT'}</td>
          <td>{data[i].funcid === 's' || data[i].funcid === 'S' ? 'Sell' : 'Buy'}</td>
          <td>{data[i].price}</td>
          <td>
            <Link href={`${`transaction?tokenId=${data[i].tokenid}&txid=${data[i].txid}`}`}><a>{data[i].txid}</a></Link>
          </td>
        </tr>
      );
    }

    return items;
  };

  return (
    <Main>
      <section>
        <div className="row">
          <div className="col-xs-12 col-md-9">
            <div className="page-header">
              <h3>
                <Link href="/"><a>Tokens</a></Link> | <span>Token orders</span> 
              </h3>
            </div>
            <table className="table table-hover table-striped">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Type</th>
                  <th>Direction</th>
                  <th>Price</th>
                  <th className="text-right">Order ID</th>
                </tr>
              </thead>
              <tbody>
              {renderOrdersList()}
              {((!props || isFetching) && !loadedAll) &&
                <tr>
                  <td colSpan={5}><ProgressBar /></td>
                </tr>
              }
              </tbody>
            </table>
          </div>
        </div>
        {(!props || (props.orders && !props.orders.length)) &&
          <h2 className="text-center text-muted">No orders yet.</h2>
        }
      </section>
    </Main>
  );
}

export async function getServerSideProps(context) {
  const {page} = context.query;
  const response = await fetch(`${serverUrl}/orders${page ? `?page=${page}` : '?page=1'}`);
  const data = await response.json();
  log('data', data)

  return {
    props: {
      orders: data,
      page: page || 1,
    },
  };
}