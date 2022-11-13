
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Main from './main';
import useInfiniteScroll from './ui-helpers/infiniteScroll';
import fetchWrapper from './ui-helpers/fetch';
import ProgressBar from './progressBar';
import log from '../helpers/logger';
import serverUrl from '../helpers/endpoint';

export default function TokenList(props) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(Number(props.page) || 1);
  const [loadedAll, setLoadedAll] = useState(false);
  const [isFetching, setIsFetching] = useInfiniteScroll(moreData);

  async function moreData() {
    if (!loadedAll) {
      const url = `${serverUrl}/tokens?page=${page + 1}`;
      const newData = await fetchWrapper(url);

      if (!newData.hasOwnProperty('error')) {
        setData(data.concat(newData));
        setPage(page + 1);
        setIsFetching(false);
      } else if (newData.hasOwnProperty('error') && newData.error === 'no tokens') {
        setLoadedAll(true);
      }
    }
  }

  useEffect(() => {
    setData(props.tokens);
  }, []);

  const renderTokensList = () => {
    const items = [];
    
    for (let i = 0; i < data.length; i++) {
      items.push(
        <tr className="fader" key={`token-list-item-${i}`}>
          <td>
            <Link href={`token-details?tokenId=${data[i].tokenid}`}><a>{data[i].name}</a></Link><br/>
            <small className="token-list-description">{data[i].description}</small>
          </td>
          <td>{data[i].supply}</td>
          <td className="text-right">{data[i].ownerAddress}</td>
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
                <span>Tokens</span> | <Link href="orders"><a>Token orders</a></Link>
              </h3>
            </div>
            <table className="table table-hover table-striped">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Supply</th>
                  <th className="text-right">Creator</th>
                </tr>
              </thead>
              <tbody>
              {renderTokensList()}
              {((!props || isFetching) && !loadedAll) &&
                <tr>
                  <td colSpan={5}><ProgressBar /></td>
                </tr>
              }
              </tbody>
            </table>
          </div>
        </div>
        {(!props || (props.tokens && !props.tokens.length)) &&
          <h2 className="text-center text-muted">No tokens yet.</h2>
        }
      </section>
    </Main>
  );
}

export async function getServerSideProps(context) {
  const {page} = context.query;
  const response = await fetch(`${serverUrl}/tokens${page ? `?page=${page}` : '?page=1'}`);
  const data = await response.json();
  log('data', data);

  return {
    props: {
      tokens: data,
      page: page || 1,
    },
  };
}