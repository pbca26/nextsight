
import React, { useState, useEffect } from 'react';
import Main from './main';
import TransactionRender from './transactionRender';
import log from '../helpers/logger';
import serverUrl from '../helpers/endpoint';

export default function Transaction(props) {
  const tx = props.transaction;
  const tokenInfo = props.tokenInfo;
  const address = '';
  const tokenRaddress = false;

  log('tx', tx);
  log('tokenInfo', tokenInfo);

  return (
    <>
      <Main>
        <TransactionRender tokenInfo={tokenInfo} transaction={tx} />
      </Main>
    </>
  );
}

export async function getServerSideProps(context) {
  const {tokenId, txid} = context.query;
  let response = await fetch(`${serverUrl}/transactions/?tokenId=${tokenId}&txid=${txid}`);
  const transaction = await response.json();
  response = await fetch(`${serverUrl}/tokens/?tokenId=${tokenId}`);
  const tokenInfo = await response.json();
  log('transaction', transaction);
  log('tokenInfo', tokenInfo);

  return {
    props: {
      transaction: transaction && !transaction.hasOwnProperty('error') ? transaction : null,
      tokenInfo: tokenInfo && !tokenInfo.hasOwnProperty('error') ? tokenInfo : null,
    },
  };
}
