
import React from 'react';
import Link from 'next/link';
import Main from './main';
import ProgressBar from './progressBar';
import log from '../helpers/logger';
import serverUrl from '../helpers/endpoint';

export default function Search(props) {
  const holdings = props.holdings;
  const {address} = props.query;

  const renderBalances = () => {
    const items = [];
    
    for (let i = 0; i < holdings.length; i++) {
      items.push(
        <tr
          className="fader"
          key={`token-address-holdings-${i}`}>
          <td>
            <Link href={`address?tokenId=${holdings[i][2].tokenid}&address=${address}`}><a>{holdings[i][2].name}</a></Link>
          </td>
          <td>{holdings[i][1]}</td>
        </tr>
      );
    }

    return items;
  };

  return (
    <Main>
      <section>
      {holdings.length > 0 &&
        <div className="row">
          <div className="col-xs-12 col-md-9">
            <div className="page-header">
              <h1>
                <span>Token holdings ({holdings.length})</span>
              </h1>
            </div>
            <div className="well well-sm ellipsis">
              <strong style={{paddingRight: '5px'}}>Address</strong> 
              <span className="text-muted">{address}</span>
              <span className="btn-copy" clip-copy="address"></span>
            </div>
            <table className="table table-hover table-striped">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {/*<tr data-ng-show="loading">
                  <td colSpan={5}><span>Waiting for token address data...</span> <span className="loader-gif"></span></td>
                </tr>*/}
                {renderBalances()}
              </tbody>
            </table>
          </div>
        </div>
      }
      {(!props || (props.holdings && !props.holdings.length)) &&
        <h2 className="text-center text-muted">No token holdings yet.</h2>
      }
      </section>
    </Main>
  );
}

export async function getServerSideProps(context) {
  const {address} = context.query;
  const response = await fetch(`${serverUrl}/balances?address=${address}`);
  const data = await response.json();
  log('data', data);

  return {
    props: {
      holdings: data,
      query: context.query,
    },
  };
}