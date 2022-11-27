import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProgressBar from './progressBar';
import fetchWrapper from './ui-helpers/fetch';
import log from '../helpers/logger';

export default function TokenDetailsRichlist(props) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getRichlist() {
    const url = `http://localhost:3000/api/richlist?tokenId=${props.tokenId}`;
    const richlist = await fetchWrapper(url);

    if (!richlist.hasOwnProperty('error')) {
      setData(data.concat(richlist));
      //setPage(page + 1);
      //setIsFetching(false);
    } else if (richlist.hasOwnProperty('error')) {
      //setLoadedAll(true);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    getRichlist();
  }, []);

  log('data', data);

  const renderRichlist = () => {
    const items = [];

    for (let i = 0; i < data.length; i++) {
      items.push(
        <tr className="fader" key={`token-details-richlist-${i}`}>
          <td><a href="{{$root.formatUrl('tokens/' + cctxid + '/address/' + item.address)}}">{data[i][0]}</a></td>
          <td>{data[i][1]}</td>
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
                    <th>Address</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {renderRichlist()}
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
          <div className="alert alert-warning">No richlist.</div>
        }
      </section>
    </>
  );
}