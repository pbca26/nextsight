
import React, { useState, useEffect } from 'react';
import Main from './main';
import TransactionRender from './transactionRender';
import log from '../helpers/logger';
import serverUrl from '../helpers/endpoint';

const getConvertion = num => {
  return num + ' TKL';
}

export default function TokenAddress(props) {
  const balance = props.balance;
  const transactions = props.transactions;
  const tokenInfo = props.tokenInfo;
  const address = {
    addrStr: props.query.address,
    balance: balance.balance,
    totalReceived: balance.received.value,
    totalSent: balance.sent.value,
    txAppearances: balance.transactions,
    unconfirmedBalance: 0,
    unconfirmedTxApperances: 0,
  };
  const tokenRaddress = false;

  log(props);

  const renderTransactions = () => {
    const items = [];

    for (let i = 0; i < transactions.length; i++) {
      items.push(
        <TransactionRender
          address={props.query.address}
          tokenInfo={tokenInfo}
          transaction={transactions[i]}
          key={`token-address-transactions-${transactions[i].tokenid}-${i}`} />);
    }

    return items;
  };

  return (
    <>
      <Main>
        <section data-ng-controller="TokenSpecificAddressController">
          <div className="secondary_navbar hidden-xs hidden-sm" data-ng-className="{'hidden': !secondaryNavbar}" data-ng-show="address.addrStr" data-ng-init="hideSNavbar=0">
            <div className="container" data-ng-if="!hideSNavbar">
              <div className="col-md-8 text-left">
                <h3>Address</h3> {address.addrStr}
                <span className="btn-copy" clip-copy="address.addrStr"></span>
              </div>
              <div className="col-md-4">
                <span className="txvalues txvalues-primary"><strong>Final Balance</strong> {address.balance} {tokenInfo.name}</span>
              </div>
            </div>
            <div className="hide_snavbar">
              <a href="#" data-ng-click="hideSNavbar=!hideSNavbar">
                <span data-ng-show="hideSNavbar"><span className="text-muted glyphicon glyphicon-chevron-down"></span></span>
                <span data-ng-show="!hideSNavbar"><span className="text-muted glyphicon glyphicon-chevron-up"></span></span>
              </a>
            </div>
          </div>
          <h1><span>Address</span> <small data-ng-show="address.addrStr">{address.balance} {tokenInfo.name}</small></h1>
          {!address.addrStr &&
            <div className="text-muted">
              <span>Loading Address Information</span> <span className="loader-gif"></span>
            </div>
          }
          {address.addrStr &&
            <div>
              <div className="well well-sm ellipsis">
                <strong style={{paddingRight: '5px'}}>Address</strong> 
                <span className="text-muted">{address.addrStr}</span>
                <span className="btn-copy" clip-copy="address.addrStr"></span>
              </div>
              <h2>Summary <small>confirmed</small></h2>
              <div className="row">
                <div className="col-md-10">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td><strong>Total Received</strong></td>
                        <td className="ellipsis text-right">{address.totalReceived} {tokenInfo.name}</td>
                      </tr>
                      <tr>
                        <td><strong>Total Sent</strong></td>
                        <td className="ellipsis text-right">{address.totalSent} {tokenInfo.name}</td>
                      </tr>
                      <tr>
                        <td><strong>Final Balance</strong></td>
                        <td className="ellipsis text-right">{address.balance} {tokenInfo.name}</td>
                      </tr>
                      <tr>
                        <td><strong>No. Transactions</strong></td>
                        <td className="ellipsis text-right">{address.txAppearances}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/*<div className="col-md-2 text-center">
                  <qrcode size="160" data="{address.addrStr}"></qrcode>
                </div>*/}
              </div>
              {address.unconfirmedTxApperances > 0 &&
                <div>
                  <h3>Unconfirmed</h3>
                  <table className="table">
                    <tbody>
                      <tr>
                        <td className="small">Unconfirmed Txs Balance</td>
                        <td className="address ellipsis text-right">{getConvertion(address.unconfirmedBalance)}</td>
                      </tr>
                      <tr>
                        <td className="small">No. Transactions</td>
                        <td className="address ellipsis text-right">{address.unconfirmedTxApperances}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              }
            </div>
          }
          <div data-ng-if="address.addrStr">
            <h2>Transactions</h2>
            {!transactions.length &&
              <div className="alert alert-warning">No transactions history.</div>
            }
            {transactions.length &&
              renderTransactions()
            }
          </div>
        </section>
      </Main>
    </>
  );
}

export async function getServerSideProps(context) {
  const {tokenId, address} = context.query;
  let response = await fetch(`${serverUrl}/balance?tokenId=${tokenId}&address=${address}`);
  const balance = await response.json();
  response = await fetch(`${serverUrl}/transactions?tokenId=${tokenId}&address=${address}`);
  const transactions = await response.json();
  response = await fetch(`${serverUrl}/tokens/?tokenId=${tokenId}`);
  const tokenInfo = await response.json();
  log('balance', balance);
  log('transactions', transactions);
  log(context.query);

  return {
    props: {
      balance: balance && !balance.hasOwnProperty('error') ? balance : null,
      transactions: transactions && !transactions.hasOwnProperty('error') ? transactions : null,
      tokenInfo: tokenInfo && !tokenInfo.hasOwnProperty('error') ? tokenInfo : null,
      query: context.query,
    },
  };
}
