import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Main from './main';
import TokenDetailsFixedSupply from './tokenDetailsFixedSupply';
import TokenDetailsNFT from './tokenDetailsNFT';
import log from '../helpers/logger';
import serverUrl from '../helpers/endpoint';

export default function TokenDetails(props) {
  const tokenInfo = props.tokenInfo;
  
  const [isLoading, setIsLoading] = useState(true);

  log('tokenInfo', tokenInfo);

  useEffect(() => {
    if (props.tokenInfo) setIsLoading(false);
  }, []);

  return (
    <>
      <Main>
        <section>
          {tokenInfo &&
            <>
              <h1>Token Overview: {tokenInfo.name}</h1>
              {isLoading &&
                <div className="text-muted">
                  <span>Loading Token Information</span>  <span className="loader-gif"></span>
                </div>
              }
              {tokenInfo.supply > 1 &&
                <TokenDetailsFixedSupply tokenInfo={tokenInfo} />
              }
              {tokenInfo.supply <= 1 &&
                <TokenDetailsNFT tokenInfo={tokenInfo} />
              }
            </>
          }
          {!tokenInfo && 
            <div className="alert alert-warning">No information available about this token.</div>
          }
        </section>
      </Main>
    </>
  );
}

export async function getServerSideProps(context) {
  const {tokenId, txid} = context.query;
  const response = await fetch(`${serverUrl}/tokens/?tokenId=${tokenId}`);
  const tokenInfo = await response.json();
  log('tokenInfo', tokenInfo)

  return {
    props: {
      tokenInfo: tokenInfo && !tokenInfo.hasOwnProperty('error') ? tokenInfo : null,
    },
  };
}